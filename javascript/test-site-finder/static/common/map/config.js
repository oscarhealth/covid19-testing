// @flow
import type {GoogleMapOptions, MapTypeStyle} from './types';

const DEFAULT_MAP_STYLE: MapTypeStyle[] = [
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {hue: '#7bcefb'},
      {saturation: 89},
      {lightness: -4},
      {visibility: 'simplified'},
    ],
  },
  {featureType: 'water', elementType: 'labels.text', stylers: [{visibility: 'off'}]},
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [{visibility: 'simplified'}, {color: '#F9F7F0'}],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{color: '#7b8a9d'}],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [{color: '#b2e6af'}],
  },
  {
    featureType: 'administrative.province',
    elementType: 'all',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{color: '#99A8BB'}],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'labels.text.fill',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {hue: '#9ab1bf'},
      {saturation: 22},
      {lightness: -10},
      {visibility: 'simplified'},
    ],
  },
  {featureType: 'transit.line', elementType: 'all', stylers: [{visibility: 'off'}]},
  {featureType: 'poi', elementType: 'all', stylers: [{visibility: 'off'}]},
  {featureType: 'poi', elementType: 'labels', stylers: [{visibility: 'off'}]},
  {
    featureType: 'poi.park',
    elementType: 'all',
    stylers: [
      {hue: '#bbe0b9'},
      {saturation: -10},
      {lightness: 10},
      {visibility: 'simplified'},
    ],
  },
  {featureType: 'poi.park', elementType: 'labels', stylers: [{visibility: 'off'}]},
  {
    featureType: 'poi.medical',
    elementType: 'geometry.fill',
    stylers: [{visibility: 'on'}, {color: '#fdebbe'}],
  },
  {featureType: 'poi.medical', elementType: 'labels', stylers: [{visiblity: 'off'}]},
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{color: '#b2e6af'}],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {hue: '#bab8a9'},
      {saturation: -89},
      {lightness: 16},
      {visibility: 'simplified'},
    ],
  },
  {featureType: 'road', elementType: 'all', stylers: [{visibility: 'simplified'}]},
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [{hue: '#bab8a9'}, {saturation: -89}, {lightness: 16}, {visibility: 'on'}],
  },
  {featureType: 'road', elementType: 'labels.icon', stylers: [{visibility: 'off'}]},
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{visibility: 'simplified'}, {color: '#7b8a9d'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [{visibility: 'simplified'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{visibility: 'on'}, {color: '#ffffff'}],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      {hue: '#ffffff'},
      {saturation: -100},
      {lightness: 100},
      {visibility: 'on'},
    ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'all',
    stylers: [{visibility: 'on'}],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry.fill',
    stylers: [{visibility: 'off'}],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'labels.icon',
    stylers: [{visibility: 'off'}],
  },
];

const ZOOM = {
  MAX: 16,
  MIN: 5,
};

// DEFAULT_MAP_OPTIONS is a partial GoogleMapOptions because center and zoom are required in the options, but are set
// via props to the Map component.
const DEFAULT_MAP_OPTIONS: $Shape<GoogleMapOptions> = {
  fullscreenControl: false,
  gestureHandling: 'cooperative',
  mapTypeControl: false,
  maxZoom: ZOOM.MAX,
  minZoom: ZOOM.MIN,
  overviewMapControl: false,
  scaleControl: false,
  streetViewControl: false,
  styles: DEFAULT_MAP_STYLE,
  zoomControl: false,
};

const config = {DEFAULT_MAP_OPTIONS, DEFAULT_MAP_STYLE, ZOOM};

export {config};
