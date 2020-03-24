/* eslint-disable flowtype/require-valid-file-annotation */
import classNames from 'classnames';
import {uniq} from 'lodash/array';
import {FormattedMessage} from 'react-intl';
import React, {useEffect, useRef, useState} from 'react';

import {SubText} from 'common/typography';
import {Typeahead} from 'javascript/anatomy/inputs/Typeahead/Typeahead';

import {LocationIcon} from 'javascript/anatomy/icons';

import {defineMessages} from 'react-intl';
import {useIntl} from '../intl/context';
const REGEX_ZIPCODE = /\d{5}/;

import css from './AddressTypeahead.scss';

const messages = defineMessages({
  currentLocation: {
    id: 'addressTypeAhead.currentLocation',
    defaultMessage: 'Current location',
    description: '',
  },
  addressPrompt: {
    id: 'addressTypeAhead.addressPrompt',
    defaultMessage: 'Enter an address, city, or ZIP code',
    description: '',
  },
});

export function AddressTypeahead({
  currentLocationDisabled,
  defaultQuery,
  onSelectPlace,
  onSelectCurrentLocation,
  isFullScreen,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [placeId, setPlaceId] = useState();
  const [isFocused, setIsFocused] = useState(false);
  const [sessionToken, setSessionToken] = useState(
    new google.maps.places.AutocompleteSessionToken()
  );

  const autocompleteService = useRef();
  const placesService = useRef();

  // This only changes on render, and changing the screen size does not currently change screen size. This means that if
  // you resize your page to be really skinny, it will still use the size until the next render (since screen resizing
  // does not trigger a re-render).
  const isMobile = window.innerWidth < 480;

  useEffect(() => {
    autocompleteService.current = new google.maps.places.AutocompleteService();
    placesService.current = new google.maps.places.PlacesService(
      document.createElement('div')
    );
  }, []);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  const buildPlacesPredictionRequest = (query) => {
    return {
      input: query,
      componentRestrictions: {
        country: 'us',
      },
      sessionToken,
    };
  };

  const onQueryUpdate = (query) => {
    setQuery(query);
    if (!query) {
      return;
    }

    if (!autocompleteService.current) {
      return;
    }

    // NOTE: Google place search doesn't surface zipcode enough when user intends to search zipcodes.
    // As a fix, when user types in 5 digits we call place search twice concurrently,
    // one for default address search and the other for region/zipcode search.
    // After get both results, we concat zipcodes and then addresses, and remove duplicates.

    const promiseAddress = new Promise((resolve) => {
      // call place api with default types for addresses
      autocompleteService.current.getPlacePredictions(
        buildPlacesPredictionRequest(query),
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(predictions);
          }
        }
      );
    });

    // Use resolved empty array for zipcode search by default
    let promiseZipcode = Promise.resolve([]);
    if (REGEX_ZIPCODE.test(query)) {
      // When input matches zipcode regex (5 digits), call place api with '(regions)' types for zipcodes
      promiseZipcode = new Promise((resolve) => {
        autocompleteService.current.getPlacePredictions(
          {...buildPlacesPredictionRequest(query), types: ['(regions)']},
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              resolve(predictions);
            }
          }
        );
      });
    }

    Promise.all([promiseAddress, promiseZipcode]).then(([addresses, zipcodes]) => {
      // Concat results by order and remove duplicates
      const dedupedResults = uniq(zipcodes.concat(addresses), 'place_id');
      const results = dedupedResults.map((prediction) => [
        prediction.place_id,
        prediction.description,
      ]);
      setResults(results);
    });
  };

  const onChange = (selectedPlaceId) => {
    setPlaceId(selectedPlaceId);

    if (!placesService.current) {
      return;
    }

    if (!selectedPlaceId) {
      return;
    }

    if (selectedPlaceId === 'CURRENT') {
      onSelectCurrentLocation();
      return;
    }

    placesService.current.getDetails({
      fields: ['geometry', 'formatted_address'],
      placeId: selectedPlaceId,
      sessionToken,
    }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setSessionToken(new google.maps.places.AutocompleteSessionToken());
        onSelectPlace({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        });
      }
    });
  };

  const onFocus = () => {
    setQuery('');
    window.setTimeout(() => {
      setIsFocused(true);
    }, 0.1);

    if (isFullScreen) {
      // small mobile screens occlude input if chrome overlays
      // scrolling ensures input content is at top of viewport
      window.scrollTo(0, 0);
    }
  };

  const onBlur = () => {
    setIsFocused(false);
  };
  const intl = useIntl();
  const allResults = currentLocationDisabled
    ? results
    : [['CURRENT', intl.formatMessage(messages.currentLocation)], ...results];

  return (
    <div className={classNames({[css.typeahead_focused]: isFocused && isFullScreen})}>
      <SubText className={css.mobileFullscreenLabel}>
        <FormattedMessage
          defaultMessage="Search for test facility"
          description=""
          id="addressTypeAhead.currentLocation.mobile.label"
        />
      </SubText>
      <Typeahead
        onBlur={onBlur}
        onFocus={onFocus}
        fetchOptions={onQueryUpdate}
        results={allResults}
        label={intl.formatMessage(messages.addressPrompt)}
        onChange={onChange}
        size={isMobile ? 'small' : 'medium'}
        value={placeId}
        getTextFromValue={(value) => {
          const index = allResults.findIndex((result) => result[0] === value);
          return allResults && allResults[index] && allResults[index][1];
        }}
        useFieldHeader={false}
        showOverlayWhenEmpty={!currentLocationDisabled}
        positionIgnoreViewport={isFullScreen && isMobile}
      />
      <div className={isMobile ? css.addressIconSmall : css.addressIcon}>
        <LocationIcon size={isMobile ? 'small' : 'medium'} />
      </div>
    </div>
  );
}
