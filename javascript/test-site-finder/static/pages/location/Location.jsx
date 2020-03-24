// @flow
import React, {useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useHistory} from 'react-router-dom';

import LocationInput from 'common/LocationInput';
import {Header2, Header4, Text} from 'common/typography';

import css from './Location.scss';

function LocationPage() {
  const history = useHistory();

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  useEffect(() => {
    if (lat && lng) {
      history.push(`/search?lat=${lat}&lng=${lng}`);
    }
  }, [lat, lng]);

  function getTitleText() {
    return (
      <Header4 component={'h2'}>
        <FormattedMessage
          defaultMessage="Enter an address, city or ZIP code to get started"
          description=""
          id="location.title.getStarted"
        />
      </Header4>
    );
  }

  function getSubtitleText() {
    return (
      <Text>
        <FormattedMessage
          defaultMessage="There are other ways to obtain testing. Please look up resources in your community and/or contact your local or state health department. Note that testing sites will be updated on a regular basis."
          description=""
          id="location.subTitle.updateDisclaimer"
        />
      </Text>
    );
  }

  function getCtaComponent() {
    return (
      <div className={css.addressInput}>
        <LocationInput setLat={setLat} setLng={setLng} isFullScreen={true} />
      </div>
    );
  }

  return (
    <div className={css.pageContainer}>
      <div className={css.heroContainer}>
        <div className={css.heroContent}>
          <Header2 className={css.title} component={'h1'}>
            <FormattedMessage
              defaultMessage="Coronavirus (COVID-19) Testing Resource Center"
              description=""
              id="location.title.text"
            />
          </Header2>
        </div>
      </div>
      <div className={css.addressWrapper}>
        <div className={css.addressContainer}>
          <div className={css.addressTitle}>{getTitleText()}</div>
          <div className={css.addressSubtitle}>{getSubtitleText()}</div>
          {getCtaComponent()}
        </div>
      </div>
    </div>
  );
}

export default LocationPage;
