// @flow
import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import 'url-search-params-polyfill';

import RESULTS from 'data/sites.json';
import Nav from 'nav/Nav';

import {useSearchResults} from './Context';
import ListHeader from './ListHeader';
import ListResults from './ListResults';
import MapResults from './MapResults';
import NoResults from './NoResults';
import {computeRecommendedVisitTime} from './slots';

import css from './index.scss';

const MAX_RESULTS = 20;
const MAX_DISTANCE_MILES = 50;
const METERS_TO_MILES = 1609;

function distanceSort(a, b) {
  return a.distance - b.distance;
}

function Results() {
  const params = new URLSearchParams(document.location.search);
  const history = useHistory();

  const [lat, setLat] = useState(Number(params.get('lat') || 38.8977));
  const [lng, setLng] = useState(Number(params.get('lng') || -77.0365));
  const [hoveredId, setHoveredId] = useState<?string>(null);

  const refs = useRef<{[string]: HTMLElement}>({});

  const setRefs = (id, ref) => {
    refs.current = {...refs.current, [id]: ref};
  };

  const onMarkerClick = (id) => {
    if (refs.current[id]) {
      refs.current[id].scrollIntoView({behavior: 'smooth'});
    }
  };

  const {results: sortedResults, setResults} = useSearchResults();

  useEffect(() => {
    const results = RESULTS.map((result) => ({
      ...result,
      distance:
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(lat, lng),
          new google.maps.LatLng(result.lat, result.lng)
        ) / METERS_TO_MILES,
    }));

    const closeResults = results.filter(
      (result) => result.distance < MAX_DISTANCE_MILES
    );

    const sortedResults = closeResults
      .sort(distanceSort)
      .slice(0, MAX_RESULTS)
      .map((result) => ({
        ...result,
        recommendedVisitTime: computeRecommendedVisitTime(result),
      }));

    setResults(sortedResults);
  }, [lat, lng, setResults]);

  useEffect(() => {
    history.replace(`${window.location.pathname}?lat=${lat}&lng=${lng}`)
  }, [lat, lng]);

  return (
    <div className={css.container}>
      <div className={css.list}>
        <ListHeader results={sortedResults} setLat={setLat} setLng={setLng} />
        <div className={css.listResults}>
          {sortedResults.length ? (
            <ListResults
              hoveredId={hoveredId}
              results={sortedResults}
              setHoveredId={setHoveredId}
              setRefs={setRefs}
            />
          ) : (
            <NoResults />
          )}
        </div>
      </div>
      <div className={css.map}>
        <MapResults
          hoveredId={hoveredId}
          lat={lat}
          lng={lng}
          onMarkerClick={onMarkerClick}
          results={sortedResults}
          setHoveredId={setHoveredId}
        />
      </div>
    </div>
  );
}

function ResultsPage({setLanguage}: any) {
  return (
    <>
      <Nav isFullScreen={true} setLanguage={setLanguage} />
      <Results />
    </>
  );
}

export default ResultsPage;
