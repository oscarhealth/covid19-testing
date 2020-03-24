// @flow
import type {Element} from 'react';
import ReactDOM from 'react-dom';

import {Marker} from './Marker';
import type {GoogleMap, LatLngLiteral} from './types';

type GoogleCustomOverlayProps = {
  id: string,
  map: GoogleMap,
  position: LatLngLiteral,
};

type ReactOverlayProps = GoogleCustomOverlayProps & {
  reactComponent: Element<typeof Marker>,
};

export function createReactOverlay(factoryProps: ReactOverlayProps) {
  /**
   * GoogleCustomOverlay extends google.maps.OverlayView and is used to manage the overlay div's interactions with the
   * map, namely:
   *   1. Ensuring the overlay div is added to the map.
   *   2. Ensuring the div is positioned (or re-positioned) when it is added or the map's bounding box changes.
   *   3. Ensuring the div is removed when necessary.
   * It takes in an id, position, and the map to mount the marker on. It is *not* responsible for rendering the React
   * component.
   *
   * Reference: https://developers.google.com/maps/documentation/javascript/reference/#OverlayView
   * Tutorial: https://developers.google.com/maps/documentation/javascript/customoverlays
   *
   * Usage:
   *   new GoogleCustomOverlay({
   *     id: 'someId',
   *     map: someMapInstance,
   *     position: {lat: 37.751439, -122.202875}
   *   });
   */
  class GoogleCustomOverlay extends window.google.maps.OverlayView {
    constructor({id, map, position}: GoogleCustomOverlayProps) {
      super();
      this.id = id;
      this.position = position;
      // containerElement is a div that holds the overlay.
      this.containerElement = document.createElement('div');
      // The overlay elements are not initialized until onAdd is called. This property is set to true (in onAdd) when
      // the overlay is ready to be used.
      this.initialized = false;

      this.setMap(map);
    }

    // onAdd is called when the map's panes are ready and the overlay has been added to the map.
    onAdd() {
      // Get map panes and append child to the pane. Append to overlayMouseTarget pane layer so we can receive DOM
      // events.
      this.getPanes().overlayMouseTarget.appendChild(this.containerElement);
      this.containerElement.style.position = 'absolute';

      this.initialized = true;
    }

    // draws or updates the overlay. This is called after onAdd and when zoom or center change. That last part is
    // important - we *need* a new point projection after the user moves the map in any way so that the overlay appears
    // in the correct spot on the map.
    draw() {
      const latlng = new window.google.maps.LatLng(
        this.position.lat,
        this.position.lng
      );
      // Correctly position the overlay relative to the map panes.
      const point = this.getProjection().fromLatLngToDivPixel(latlng);

      this.containerElement.style.left = `${point.x}px`;
      this.containerElement.style.top = `${point.y}px`;
    }

    // onRemove is called after a call to .setMap(null).
    onRemove() {
      this.containerElement.parentNode.removeChild(this.containerElement);
      this.containerElement = null;
    }

    // Custom method to remove the overlay from the map. Abstracted this out so client doesn't need to know about
    // .setMap(null) Google Maps-y paradigm.
    remove() {
      this.setMap(null);
    }

    // Custom method to get marker's Google Maps LatLng.
    getPosition() {
      return new window.google.maps.LatLng(this.position.lat, this.position.lng);
    }
  }

  /**
   * ReactOverlay extends the GoogleCustomOverlay. It is responsible for React component operations on the map, mainly
   * drawing and removing.
   *
   * Usage:
   *   new ReactOverlay({
   *     id: 'someId',
   *     map: someMapInstance,
   *     position: {lat: 37.751439, -122.202875},
   *     reactComponent: someReactComponent
   *   });
   */
  class ReactOverlay extends GoogleCustomOverlay {
    constructor(props: ReactOverlayProps) {
      super(props);
      this.reactComponent = props.reactComponent;
    }

    draw() {
      super.draw();
      ReactDOM.render(this.reactComponent, this.containerElement);
    }

    onRemove() {
      ReactDOM.unmountComponentAtNode(this.containerElement);
      super.onRemove();
    }

    // We want to update the React component (ex: pin changes) and manually trigger draw. draw is automatically called
    // by Google Maps whenever the map loads or the map bounds have changed, neither of which is guaranteed if the
    // React component is being updated.
    redrawWithComponent(reactComponent: Element<typeof Marker>) {
      // Don't manually draw the overlay until the overlay is initialized.
      if (!this.initialized) {
        return;
      }

      this.reactComponent = reactComponent;
      this.draw();
    }
  }

  return new ReactOverlay(factoryProps);
}
