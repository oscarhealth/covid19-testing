// @flow
import React, {useEffect, useState} from 'react';

import {GoogleMapLoader} from './GoogleMapLoader';

export default function GoogleMapLoaded(props: *) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    GoogleMapLoader.load(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }
  return props.children;
}