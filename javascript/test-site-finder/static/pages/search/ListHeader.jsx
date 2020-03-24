// @flow
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Header3, FinePrint} from 'common/typography';

import LocationInput from 'common/LocationInput';
import type {Facility} from './types';

import css from './ListHeader.scss';

type Props = {|
  results: Facility[],
  setLat: (number) => void,
  setLng: (number) => void,
|};

export default function ListHeader({results, setLat, setLng}: Props) {
  return (
    <div className={css.container}>
      <Header3 component={'h1'}>
        <FormattedMessage
          defaultMessage="COVID-19 testing sites"
          description="Title for search results"
          id="search.title"
        />
      </Header3>
      <div className={css.location}>
        <LocationInput
          setLat={setLat}
          setLng={setLng}
          isFullScreen={false}
          size="small"
        />
      </div>
      {!!results.length && (
        <div className={css.resultCountContainer}>
          <FinePrint className={css.resultCount}>
            <FormattedMessage
              defaultMessage="Showing {num} nearest results"
              description="Description for how many sites found nearby"
              id="search.numResults"
              values={{
                num: results.length,
              }}
            />
          </FinePrint>
        </div>
      )}
    </div>
  );
}
