// @flow
import React, {useEffect} from 'react';
import {useHistory, Redirect} from 'react-router-dom';

import {TextLink} from 'common/TextLink';
import BackIcon from 'common/BackIcon.svg';
import {
  Header1,
  Header2,
  Header3,
  Header4,
  Header5,
  SubText,
  Text,
} from 'common/typography';
import {formatPhoneNumberWithParens} from 'common/utils';
import Nav from 'nav/Nav';
import {useSearchResults} from 'pages/search/Context';
import {formatTime} from 'pages/search/FacilityItem';
import {NUM_SLOTS} from 'pages/search/index';
import {FormattedMessage} from 'react-intl';

import printIcon from './Print.svg';

import css from './index.scss';

export default function SearchResults({setLanguage}: any) {
  const {resultId, slotIndex, results} = useSearchResults();
  const history = useHistory();

  const result = results.find((result) => result.facility_id === resultId);

  useEffect(() => {
    if (!result) {
      history.replace(`${`/search${window.location.search}`}`);
    }
  }, [result]);

  if (!result) {
    return <Nav setLanguage={setLanguage} />;
  }

  const {
    address,
    city,
    distance,
    facility_name,
    facility_id,
    phone,
    recommendedVisitTime: slot,
    state,
    zip,
  } = result;

  let claimedTime = null;
  let slotDateStr = null;
  let slotCount = NUM_SLOTS;
  if ('slot_count' in result) {
    slotCount = result['slot_count'];
  }

  if (slot) {
    const start = formatTime(slot.slotStart);
    const end = formatTime(slot.slotEnd);
    slotDateStr = slot.slotStart.format('MM/DD h a');
    claimedTime = (
      <Header4 className={css.claimedTime} component={'h2'}>
        <FormattedMessage
          defaultMessage="Your recommended testing window is {start} - {end} on {date}. This is not an appointment."
          description=""
          id="result.section1.heading2"
          values={{
            start: start,
            end: end,
            date: slot.slotStart.format('MM/DD'),
          }}
        />
      </Header4>
    );
  }

  const backToFacilities = () => {
    history.push(`/search${window.location.search}`);
  };

  return (
    <>
      <Nav setLanguage={setLanguage} />
      <div className={css.container}>
        <div className={css.taskBar}>
          <TextLink onClick={backToFacilities} className={css.backContainer}>
            <img alt="" src={BackIcon} />
            <SubText className={css.textLink}>
              <FormattedMessage
                defaultMessage="Back to testing sites"
                description=""
                id="result.action.back"
              />
            </SubText>
          </TextLink>
          <div className={css.actionsContainer}>
            <TextLink className={css.action} onClick={window.print}>
              <img alt="" className={css.icon} src={printIcon} />
              <SubText className={css.textLink}>
                <FormattedMessage
                  defaultMessage="Print"
                  description=""
                  id="result.action.print"
                />
              </SubText>
            </TextLink>
          </div>
        </div>
        <div className={css.divider} />
        <Header1 className={css.header} component={'h1'}>
          <FormattedMessage
            defaultMessage="What you need to know before getting tested"
            description=""
            id="result.section1.heading1"
          />
        </Header1>
        {claimedTime}
        <div className={css.facility}>
          <Text>{facility_name}</Text>
          <Text>{address}</Text>
          <Text>{`${city}, ${state} ${zip}`}</Text>
          {phone && (
            <SubText>
              <TextLink href={`tel:${phone}`}>
                {formatPhoneNumberWithParens(phone)}
              </TextLink>
            </SubText>
          )}
        </div>
        <Text className={css.claimedTime} component={'h2'}>
          <strong>
            <FormattedMessage
              defaultMessage="Please retain this information for your reference."
              description=""
              id="result.section1.heading3"
            />
          </strong>
        </Text>
        <div className={css.divider} />
        <div className={css.info}>
          <Header3 className={css.infoHeader}>
            <FormattedMessage
              defaultMessage="Testing site may have specific guidelines and requirements for arrival."
              description=""
              id="result.section2.heading1"
            />
          </Header3>
        </div>
        <div className={css.divider} />
      </div>
    </>
  );
}
