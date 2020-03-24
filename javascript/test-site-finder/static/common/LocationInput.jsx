// @flow
import React, {useCallback, useEffect, useState} from 'react';

import {AddressTypeahead} from './AddressTypeahead';

import css from './LocationInput.scss';

export default function LocationInput({setLat, setLng, isFullScreen}) {
  const [address, setAddress] = useState('');

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLocationDisabled, setCurrentLocationDisabled] = useState(false);
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLng, setCurrentLng] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLng(position.coords.longitude);
      },
      (err) => {
        setCurrentLocationDisabled(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
      }
    );
  }, []);

  useEffect(() => {
    if (useCurrentLocation && currentLat && currentLng) {
      setAddress('Current location');
      setLat(currentLat);
      setLng(currentLng);
    }
  }, [useCurrentLocation, currentLat, currentLng]);

  const onSelectCurrentLocation = useCallback(() => {
    setUseCurrentLocation(true);
  }, [setUseCurrentLocation]);

  const onSelectPlace = useCallback(
    (place) => {
      setUseCurrentLocation(false);
      setAddress(place.address);
      setLat(place.lat);
      setLng(place.lng);
    },
    [setAddress, setLat, setLng]
  );

  return (
    <div className={css.address}>
      <AddressTypeahead
        currentLocationDisabled={currentLocationDisabled}
        defaultQuery={address}
        onSelectCurrentLocation={onSelectCurrentLocation}
        onSelectPlace={onSelectPlace}
        isFullScreen={isFullScreen}
      />
    </div>
  );
}
