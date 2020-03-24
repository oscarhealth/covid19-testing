// @flow
import React, {useEffect, useRef} from 'react';

import {Map} from 'common/map/Map';
import {Marker, PinStyle} from 'common/map/Marker';

import type {Facility} from './types';

const DEFAULT_ZOOM = 9;

type Props = {|
  hoveredId: ?string,
  lat: number,
  lng: number,
  onMarkerClick: (string) => void,
  results: Facility[],
  setHoveredId: (?string) => void,
|};

export default function MapResults({
  hoveredId,
  lat,
  lng,
  onMarkerClick,
  results,
  setHoveredId,
}: Props) {
  const mapRef = useRef(null);

  const anchorMarkerId = `${lat}, ${lng}`;
  const markerIds = results.map((result) => result.facility_id);
  const allMarkerIds = [anchorMarkerId, ...markerIds];

  const anchorMarker = (
    <Marker id={anchorMarkerId} key="anchor" position={{lat, lng}}>
      <Marker.Pin style={PinStyle.PULSE} />
    </Marker>
  );

  const markers = results.map((result) => (
    <Marker
      forceHover={result.facility_id === hoveredId}
      id={result.facility_id}
      key={result.facility_id}
      onClick={onMarkerClick}
      onHover={setHoveredId}
      position={{lat: result.lat, lng: result.lng}}
    >
      <Marker.Pin style={PinStyle.DEFAULT} />
      <Marker.Tooltip>{result.facility_name}</Marker.Tooltip>
    </Marker>
  ));

  const allMarkers = [anchorMarker, ...markers];

  useEffect(() => {
    if (mapRef.current) {
      if (!markerIds.length) {
        mapRef.current.getWrappedInstance().setCenter({lat, lng});
        mapRef.current.getWrappedInstance().setZoom(DEFAULT_ZOOM);
      } else {
        mapRef.current.getWrappedInstance().fitBoundsToMarkers(allMarkerIds);
      }
    }
  }, [mapRef, JSON.stringify(allMarkerIds)]);

  return (
    <Map wrappedComponentRef={mapRef} defaultCenter={{lat, lng}} defaultZoom={DEFAULT_ZOOM}>
      <Map.Markers>{allMarkers}</Map.Markers>
      <Map.ZoomControl />
    </Map>
  );
}
