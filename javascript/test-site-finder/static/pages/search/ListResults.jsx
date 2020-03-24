// @flow
import React from 'react';

import Banner from './Banner';
import FacilityItem from './FacilityItem';
import type {Facility} from './types';

type Props = {|
  hoveredId: ?string,
  results: Facility[],
  setHoveredId: (?string) => void,
  setRefs: (HTMLElement) => void,
|};

export default function ListResults({
  hoveredId,
  results,
  setHoveredId,
  setRefs,
}: Props) {
  return (
    <>
      {!!results.length && <Banner />}
      {results.map((result) => {
        const setRef = (ref) => {
          setRefs(result.facility_id, ref);
        };
        return (
          <FacilityItem
            facility={result}
            hoveredId={hoveredId}
            key={result.facility_id}
            setHoveredId={setHoveredId}
            setRef={setRef}
          />
        );
      })}
    </>
  );
}
