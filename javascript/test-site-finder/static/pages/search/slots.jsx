import alea from "seedrandom";
import moment from "moment";

import {isClosed, getHoursOfOp} from './hoursOfOperation';

const LOCALSTORAGE_SEED_KEY = 'USER_SEED';
const MIN_TIME_SLOT_SIZE = 180; // hours

function getNumHours(data) {
  return extractTime(data['end']) - extractTime(data['start']);
}

function extractTime(time) {
  if (!time) {
    return 0;
  }

  let [hours, minutes, seconds] = time.split(':');

  return parseInt(hours, 10) + parseInt(minutes, 10) / 60;
}

function getNextOpenDay(facility, firstCandidate) {
  const nextOpenDayCandidate = firstCandidate.clone().hour(0).minute(0);
  while (true) {
    if (!isClosed(facility, nextOpenDayCandidate)) {
      return nextOpenDayCandidate;
    }

    nextOpenDayCandidate.add(1, 'days');
  }
}

function calculateSlots(facility, day) {
  if (isClosed(facility, day)) {
    return [];
  }

  const slotLengths = [];

  const hours = getHoursOfOp(facility, day);
  const numMinutesOpen = getNumHours(hours) * 60;

  if (numMinutesOpen === 0) {
    return [];
  } else if (numMinutesOpen < 360) { // 6 hours
    slotLengths.push(numMinutesOpen);
  } else {
    const numSlots = Math.ceil(numMinutesOpen / (MIN_TIME_SLOT_SIZE + 60));

    while (slotLengths.length < numSlots) {
      slotLengths.push(MIN_TIME_SLOT_SIZE);
    }

    let leftoverMinutes = (numMinutesOpen - (MIN_TIME_SLOT_SIZE * numSlots));

    let currentIndex = slotLengths.length - 1;
    while (leftoverMinutes > 0) {
      slotLengths[currentIndex] += Math.min(60, leftoverMinutes);

      currentIndex -= 1;
      leftoverMinutes -= 60;
    }
  }

  const slots = [];
  let startOfSlot = extractTime(hours['start']) * 60;
  slotLengths.forEach(slotLength => {
    slots.push({
      slotStart: day.clone().hour(0).minute(startOfSlot),
      slotEnd: day.clone().hour(0).minute(startOfSlot + slotLength)
    });

    startOfSlot = startOfSlot + slotLength;
  });

  return slots;
}

function getAllSlotOptions(facility, requestedDate) {
  const tomorrow = requestedDate.clone().add(1, 'days');
  const nextOpenDay = getNextOpenDay(facility, tomorrow);

  return calculateSlots(facility, requestedDate)
    .filter(slot => slot.slotStart > requestedDate.clone().add(1, 'hours'))
    .concat(calculateSlots(facility, nextOpenDay));
}

function computeRecommendedVisitTime(facility) {
  if (!localStorage.getItem(LOCALSTORAGE_SEED_KEY)) {
    localStorage.setItem(
      LOCALSTORAGE_SEED_KEY,
      Math.floor(Math.random() * 1000000).toString()
    );
  }

  let now = moment();
  const allSlots = getAllSlotOptions(facility, now);

  const rng = new alea(
    localStorage.getItem(LOCALSTORAGE_SEED_KEY) + ':' + facility['facility_id']
  );
  const randomIndex = Math.floor(rng() * allSlots.length);

  return allSlots[randomIndex];
}

export {calculateSlots, getAllSlotOptions, computeRecommendedVisitTime}