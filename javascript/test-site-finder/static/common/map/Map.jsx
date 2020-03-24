// @flow
import {isEqual} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import type {ChildrenArray, Element, ElementRef} from 'react';
import {injectIntl} from 'react-intl';
import type {IntlShape} from 'react-intl';
import {compose} from 'redux';

import {wrapConfigElements} from 'javascript/anatomy/util/ConfigElements';

import {GoogleMapLoader} from './GoogleMapLoader';
import {Marker} from './Marker';
import {createReactOverlay} from './ReactOverlay';
import {config} from './config';
import type {
  GoogleMap,
  LatLng,
  LatLngBounds,
  LatLngBoundsLiteral,
  LatLngLiteral,
} from './types';

import css from './Map.scss';

type Props = {
  // If you include defaultCenter/defaultZoom, remember to include *both* - they are required to load a map if you
  // initialize a map with them.
  defaultCenter?: LatLngLiteral,
  defaultZoom?: number,
  elements: {
    Markers?: {
      children: ChildrenArray<Element<typeof Marker>>,
    },
    ZoomControl?: {},
  },
  intl: IntlShape,
  onBoundsChanged?: (bounds: LatLngBoundsLiteral) => void,
  onMapLoad?: () => void,
};

type State = {
  loaded: boolean,
};

/**
 * Map is a wrapper on top of a Google Map. It provides functionality for rendering a map and map markers as well as
 * a custom zoom control and refresh results trigger. Custom map options, max/min zoom, and basemap styling are *not*
 * supported.
 *
 * NOTE: To set a ref on the map component, use wrappedComponentRef instead of ref. This is due to the way
 * wrapConfigElements works.
 *
 * Public methods that you can call with a reference to the map component:
 *   - getBounds: Gets the map's current bounding box (LatLngBounds return type).
 *   - getCenter: Gets the map's current center (LatLng return type).
 *   - getZoom: Gets the map's current zoom (number return type).
 *   - fitBoundsToMarkers: Takes in a list of marker IDs and fits the map's bounds to the associated markers.
 *   - setBounds: Takes in a LatLngBounds and fits the map to them.
 *
 * Usage:
 *   <Map
 *     defaultCenter={{lat: 40.714286, lng: -73.998864}}
 *     defaultZoom={5}
 *     wrappedComponentRef={this.setSomeRef}
 *   >
 *     <Map.Markers>
 *       {markers}
 *     </Map.Markers>
 *     <Map.ZoomControl />
 *   </Map
 */
class MapComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const validPosition = !!props.defaultCenter === !!props.defaultZoom;

    if (!validPosition) {
      throw new Error('Must include both defaultCenter and defaultZoom or neither');
    }
  }

  state = {
    loaded: false,
  };

  componentDidMount() {
    GoogleMapLoader.load(this._onMapLoad, this.props.intl.locale);
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.state.loaded) {
      return;
    }

    const prevMarkers = React.Children.toArray(
      prevProps.elements.Markers?.children || []
    );
    const currMarkers = React.Children.toArray(
      this.props.elements.Markers?.children || []
    );

    const markersDeepEqual = isEqual(
      prevMarkers.map((marker) => marker.props),
      currMarkers.map((marker) => marker.props)
    );
    const markerIdsEqual = isEqual(
      prevMarkers.map((marker) => marker.props.id),
      currMarkers.map((marker) => marker.props.id)
    );

    // Redraw the overlays if there's any change in the marker's props. This can be caused by changes in hover states
    // or the tooltip.
    if (!markersDeepEqual) {
      this._drawOverlays();
    }
    // Fit map bounds if the marker IDs have changed. This signifies any changes in the markers themselves (and
    // potentially the position of the map).
    if (!markerIdsEqual) {
      this._fitMapBounds(currMarkers);
    }
  }

  componentWillUnmount() {
    window.google.maps.event.clearInstanceListeners(this._map);
  }

  _map: GoogleMap;
  _mapElement: ElementRef<any> = React.createRef();
  _overlayById: {[string]: any} = {};

  _setMapElement = (mapElement: ElementRef<any>) => (this._mapElement = mapElement);

  _onBoundsChanged = () => {
    const {onBoundsChanged} = this.props;
    if (onBoundsChanged) {
      onBoundsChanged(this._map.getBounds().toJSON());
    }
  };

  _onUserMapChange = () => {
    this._onBoundsChanged();
  };

  _onMapLoad = () => {
    const {defaultCenter, defaultZoom, onMapLoad} = this.props;
    const mapOptions = config.DEFAULT_MAP_OPTIONS;

    if (defaultCenter) {
      mapOptions.center = defaultCenter;
    }
    if (defaultZoom) {
      mapOptions.zoom = defaultZoom;
    }

    this._map = new window.google.maps.Map(this._mapElement.current, mapOptions);

    window.google.maps.event.addListener(this._map, 'dragend', this._onUserMapChange);
    window.google.maps.event.addListener(
      this._map,
      'zoom_changed',
      this._onUserMapChange
    );

    // Render initial markers, if any.
    this._drawOverlays();

    this.setState({loaded: true}, () => {
      if (onMapLoad) {
        onMapLoad();
      }
    });
  };

  _drawOverlays = () => {
    const markers = React.Children.toArray(this.props.elements.Markers?.children || []);
    const existingIds = Object.keys(this._overlayById);
    const newIds = [];

    markers.forEach((marker) => {
      const currOverlay = this._overlayById[marker.props.id];

      newIds.push(marker.props.id);

      // NOTE(chrisng): If we run into performance issues, think about making currOverlay a React component and using
      // ReactDOM.render instead.
      if (currOverlay) {
        // Update the React component in case it changed and then redraw.
        currOverlay.redrawWithComponent(marker);
      } else {
        this._overlayById[marker.props.id] = createReactOverlay({
          id: marker.props.id,
          map: this._map,
          position: marker.props.position,
          reactComponent: marker,
        });
      }
    });

    // Delete overlays that should no longer exist.
    existingIds.forEach((id) => {
      if (newIds.indexOf(id) === -1) {
        this._overlayById[id].remove();
        delete this._overlayById[id];
      }
    });
  };

  _fitMapBounds = (markers: Array<Element<typeof Marker>>) => {
    // Fit bounds iff there are markers. If we fit bounds when there are no markers, we get a blank screen on the map
    // because there is no bounding box.
    if (markers.length) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach((marker) => {
        bounds.extend(marker.props.position);
      });
      this._map.fitBounds(bounds);

      this._onBoundsChanged();
    }
  };

  getBounds = (): LatLngBounds => this._map.getBounds();

  getCenter = (): LatLng => this._map.getCenter();

  getZoom = (): number => this._map.getZoom();

  fitBoundsToMarkers = (ids: string[]) => {
    const markers = ids
      .filter((id) => {
        const overlay = this._overlayById[id];
        if (!overlay) {
          if (__DEBUG__) {
            // eslint-disable-next-line no-console
            console.error(`Could not find marker with ID ${id}`);
          }
          return false;
        }
        return true;
      })
      .map((id) => this._overlayById[id].reactComponent);

    this._fitMapBounds(markers);
  };

  setBounds = (bounds: LatLngBounds) => {
    if (!this.state.loaded) {
      return;
    }
    this._map.fitBounds(bounds);
  };

  setCenter = (center: LatLng) => {
    if (!this.state.loaded) {
      return;
    }
    this._map.setCenter(center);
  };

  setZoom = (zoom: number) => {
    if (!this.state.loaded) {
      return;
    }
    this._map.setZoom(zoom);
  };

  // We initialize Google Maps with a min/max zoom, so min/max zoom is handled for us.
  _zoomIn = () => this._map.setZoom(this._map.getZoom() + 1);
  _zoomOut = () => this._map.setZoom(this._map.getZoom() - 1);

  _renderZoomControl() {
    if (!this.props.elements.ZoomControl) {
      return null;
    }

    return (
      <div className={css.zoomControlContainer}>
        <div className={css.zoomInClickable} onClick={this._zoomIn}>
          <div className={css.zoomInContainer}>
            <img
              alt="zoom-in-map"
              className={css.zoomInButton}
              src="https://maps.gstatic.com/mapfiles/api-3/images/tmapctrl_hdpi.png"
            />
          </div>
        </div>
        <div className={css.zoomSplit} />
        <div className={css.zoomOutClickable} onClick={this._zoomOut}>
          <div className={css.zoomOutContainer}>
            <img
              alt="zoom-out-map"
              className={css.zoomOutButton}
              src="https://maps.gstatic.com/mapfiles/api-3/images/tmapctrl_hdpi.png"
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={css.map}>
        {this._renderZoomControl()}
        <div className={css.map} ref={this._mapElement} />
      </div>
    );
  }
}

const Map = compose(
  wrapConfigElements({
    Markers: {
      children: PropTypes.node,
    },
    ZoomControl: {},
  }),
  (component) => injectIntl(component, {withRef: true})
)(MapComponent);

export {Map, MapComponent};
