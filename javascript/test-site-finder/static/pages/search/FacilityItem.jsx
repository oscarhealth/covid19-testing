// @flow
import classNames from 'classnames';
import moment from 'moment';
import React from 'react';
import {defineMessages, FormattedMessage} from 'react-intl';
import {Link, useHistory} from 'react-router-dom';

import {Button} from 'common/button';
import {TextLink} from 'common/TextLink';
import {Header4, SubText, Text} from 'common/typography';
import {formatPhoneNumberWithParens, toFixedNoTrailing} from 'common/utils';
import {useIntl} from 'intl/context';
import DropdownIcon from 'common/DropdownIcon.svg';
import UpArrowIcon from 'common/UpArrowIcon.svg';
import RightArrow from 'common/RightArrowIconWhite.svg';

import {useToggle} from 'javascript/hooks/useToggle';

import {useSearchResults} from './Context';
import type {Facility, TimeSlot} from './types';

import css from './FacilityItem.scss';
import {getHoursOfOp, isClosed} from './hoursOfOperation';

type Props = {|
  facility: Facility,
  hoveredId: ?string,
  setHoveredId: (?string) => void,
  setRef: (HTMLElement) => void,
|};

const Messages = defineMessages({
  HOURS: {
    defaultMessage: 'Hours:',
    description: 'Title for hours the facility is open',
    id: 'search.facility.hours',
  },
  CLOSED: {
    defaultMessage: 'Closed',
    description: 'Label indicating that a facility is closed',
    id: 'search.facility.closed',
  },
  SHOW_MORE: {
    defaultMessage: 'Show more',
    description: 'Toggle to display the hours of operation',
    id: 'search.facility.showMore',
  },
  SHOW_LESS: {
    defaultMessage: 'Show less',
    description: 'Toggle to hide the hours of operation',
    id: 'search.facility.showLess',
  },
  UNABLE_TO_DETERMINE: {
    defaultMessage: 'Unable to determine availability',
    description:
      'Label indicating that we are currently unable to determine if the facility is available',
    id: 'search.facility.unableToDetermine',
  },
});

export default function FacilityItem(props: Props) {
  const {facility, setRef, setHoveredId, hoveredId} = props;
  const {address, city, distance, facility_name, phone, state, zip} = facility;

  const intl = useIntl();
  const history = useHistory();
  const {setResultId, setSlotIndex} = useSearchResults();
  const showMoreToggle = useToggle(false);

  const handleMouseEnter = () => {
    setHoveredId(facility.facility_id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
  };

  function RecommendedVisitTime() {
    const {recommendedVisitTime} = facility;
    if (!recommendedVisitTime) return false;

    const recommendedVisitTimeStart = formatTime(recommendedVisitTime.slotStart);
    const recommendedVisitTimeEnd = formatTime(recommendedVisitTime.slotEnd);

    return (
      <SubText>
        <strong>
          <FormattedMessage
            defaultMessage="Recommended testing window: {start} - {end} on {date}. This is not an appointment."
            description=""
            id="search.facility.recommendedVisitTime"
            values={{
              start: recommendedVisitTimeStart,
              end: recommendedVisitTimeEnd,
              date: recommendedVisitTime.slotStart.format('MM/DD'),
            }}
          />
        </strong>
      </SubText>
    );
  }

  function ChooseSite() {
    const onClick = () => {
      setResultId(facility.facility_id);
      setSlotIndex(0);
      history.push(`/search/result${window.location.search}`);
    };

    return (
      <div className={css.timeSlotsContainer}>
        <Button className={css.slotButton} onClick={onClick} type="primary">
          <SubText className={css.slotTime}>Choose this site</SubText>
          <img alt="" src={RightArrow} className={css.arrow} />
        </Button>
      </div>
    );
  }

  function HoursToday() {
    const dayToday = moment();

    const hoursToday = getHoursOfOp(facility, dayToday);

    const startTimeToday = moment(hoursToday.start,'HH:mm:ss').format('h:mm a');
    const endTimeToday = moment(hoursToday.end, 'HH:mm:ss').format('h:mm a');

    const isClosedToday = isClosed(facility, dayToday);

    return (
      <div className={css.row}>
        <div className={css.hourHeader}>
          <SubText>
            <strong>{intl.formatMessage(Messages.HOURS)} </strong>
          </SubText>
        </div>
        <SubText>
          {isClosedToday
            ? intl.formatMessage(Messages.CLOSED)
            : `${startTimeToday} - ${endTimeToday}`
          }
        </SubText>
      </div>
    );
  }

  function HoursOfOperation() {
    if (typeof facility.hours_of_operation === 'undefined') {
      return null;
    }

    const ShowMore = () => {
      return (
        <button className={css.toggleButton} onClick={showMoreToggle.open}>
          <div className={css.toggleMargin}>
            <SubText className={css.toggleText}>
              {intl.formatMessage(Messages.SHOW_MORE)}
            </SubText>
          </div>
          <div className={css.icon}>
            <img alt="" src={DropdownIcon} />
          </div>
        </button>
      );
    };
    const ShowLess = () => {
      return (
        <button className={css.toggleButton} onClick={showMoreToggle.close}>
          <div className={css.toggleMargin}>
            <SubText className={css.toggleText}>
              {intl.formatMessage(Messages.SHOW_LESS)}
            </SubText>
          </div>
          <div className={css.icon}>
            <img alt="" src={UpArrowIcon} />
          </div>
        </button>
      );
    };

    // sort hours of operation by day
    const ORDERED_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const sortedHoursOfOp = {};

    ORDERED_DAYS.forEach((day) => {
      if (!day in facility.hours_of_operation) {
        return;
      }

      sortedHoursOfOp[day] = facility.hours_of_operation[day];
    });

    const hours = ORDERED_DAYS.map(day => {
      const dayMoment = moment(day, 'ddd');
      const dayObject = getHoursOfOp(facility, dayMoment);
      const dayAbbrev = dayMoment.format('ddd');
      const startTime = moment(dayObject.start, 'HH:mm:ss').format('h:mm a');
      const endTime = moment(dayObject.end, 'HH:mm:ss').format('h:mm a');
      const isClosedOnDay = isClosed(facility, dayMoment);

      return (
        <div className={css.flex} key={day}>
          <div className={css.hourHeader}>
            <SubText>
              <strong>{dayAbbrev}: </strong>
            </SubText>
          </div>
          <SubText>
            {isClosedOnDay
              ? intl.formatMessage(Messages.CLOSED)
              : `${startTime} - ${endTime}`
            }
          </SubText>
        </div>
      );
    });

    return (
      <div className={css.hoursOfOperation}>
        {showMoreToggle.isOpen && hours}
        {showMoreToggle.isOpen ? <ShowLess /> : <ShowMore />}
      </div>
    );
  }

  const cssContainer = classNames({
    [css.container]: true,
    [css.highlight]: facility.facility_id === hoveredId,
  });

  return (
    <div
      className={cssContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={setRef}
    >
      <div className={css.itemContainer}>
        <div className={css.row}>
          <Text>
            <strong>{facility_name}</strong>
          </Text>
        </div>
        <div className={css.row}>
          <div className={css.address}>
            <SubText>{address}</SubText>
            <SubText>{`${city}, ${state} ${zip}`}</SubText>
          </div>
          <div className={css.distance}>
            <SubText>{toFixedNoTrailing(distance, 1)}mi</SubText>
          </div>
        </div>
        <div className={css.row}>
          <div className={css.metadata}>
            {phone && (
              <SubText>
                <TextLink href={`tel:${phone}`}>
                  {formatPhoneNumberWithParens(phone)}
                </TextLink>
              </SubText>
            )}
          </div>
        </div>
        {facility.facility_metadata && (
          <div className={css.row}>
            <SubText>{facility.facility_metadata}</SubText>
          </div>
        )}
        <div className={css.recommended}>
          <RecommendedVisitTime />
        </div>
        <HoursToday />
        <HoursOfOperation />
        <ChooseSite />
      </div>
    </div>
  );
}

export function formatTime(time) {
  if (time.minute()) {
    return time.format('h:mma');
  } else {
    return time.format('ha');
  }
}
