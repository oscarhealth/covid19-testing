// @flow
// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngLiteral
export type LatLngLiteral = {
  lat: number,
  lng: number,
};

// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
export type LatLng = {
  lat: () => number,
  lng: () => number,
};

// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral
export type LatLngBoundsLiteral = {
  east: number,
  north: number,
  south: number,
  west: number,
};

// https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
export type LatLngBounds = {
  contains: (latLng: LatLngLiteral) => boolean,
  extend: (point: LatLng | LatLngLiteral) => LatLngBounds,
  toJSON: () => LatLngBoundsLiteral,
};

// https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeStyle
export type MapTypeStyle = {
  elementType: string,
  featureType: string,
  // Styling options for given elementType and featureType.
  stylers: {[string]: string | number}[],
};

// https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling
type GestureHandlingType = 'cooperative' | 'greedy' | 'none' | 'auto';

// https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions
export type GoogleMapOptions = {
  center: LatLngLiteral,
  fullscreenControl: boolean,
  gestureHandling: GestureHandlingType,
  mapTypeControl: boolean,
  maxZoom: number,
  minZoom: number,
  overviewMapControl: boolean,
  scaleControl: boolean,
  streetViewControl: boolean,
  styles: MapTypeStyle[],
  zoom: number,
  zoomControl: boolean,
};

// https://developers.google.com/maps/documentation/javascript/reference/map#Map
export type GoogleMap = {
  fitBounds: (bounds: LatLngBounds | LatLngBoundsLiteral, padding?: number) => void,
  getBounds: () => LatLngBounds,
  getCenter: () => LatLng,
  getZoom: () => number,
  maxZoom: number,
  minZoom: number,
  panTo: (latLng: LatLng | LatLngLiteral) => void,
  setZoom: (zoom: number) => void,
};
