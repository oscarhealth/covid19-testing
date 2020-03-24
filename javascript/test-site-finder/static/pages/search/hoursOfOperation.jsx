const DAY_KEY_MAP = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
};

const DEFAULT_OPEN = '08:00:00';
const DEFAULT_CLOSE = '20:00:00';

// If we don't have any hours of operation
const DEFAULT_HOURS_OF_OPERATION = {
  sun: {
    start: DEFAULT_OPEN,
    end: DEFAULT_CLOSE,
  },
  mon: {
    start: DEFAULT_OPEN,
    end: DEFAULT_CLOSE,
  },
  tue: {
    start: DEFAULT_OPEN,
    end: DEFAULT_CLOSE,
  },
  wed: {
    start: DEFAULT_OPEN,
    end: DEFAULT_CLOSE,
  },
  thu: {
    start: DEFAULT_OPEN,
    end: DEFAULT_CLOSE,
  },
  fri: {
    start: DEFAULT_OPEN,
    end: DEFAULT_CLOSE,
  },
  sat: {
    start: DEFAULT_OPEN,
    end: DEFAULT_CLOSE,
  },
};

function isClosed(facility, onDay) {
  const hasHoursData = Object.values(facility['hours_of_operation']).some(hours => hours['start'] || hours['end']);
  const hoursOfOp = facility['hours_of_operation'] || DEFAULT_HOURS_OF_OPERATION;

  const dayIndex = onDay.day();

  const hours = hoursOfOp[DAY_KEY_MAP[dayIndex]];
  return hasHoursData && !hours['start'] && !hours['end'];
}

function getHoursOfOp(facility, onDay) {
  const dayIndex = onDay.day();

  const hoursOfOp = facility['hours_of_operation'] || DEFAULT_HOURS_OF_OPERATION;
  const hours = {...hoursOfOp[DAY_KEY_MAP[dayIndex]]};
  if (!hours['start']) {
    hours['start'] = DEFAULT_OPEN;
  }
  if (!hours['end']) {
    hours['end'] = DEFAULT_CLOSE;
  }

  return hours;
}

export {
  DAY_KEY_MAP,
  DEFAULT_OPEN,
  DEFAULT_CLOSE,
  DEFAULT_HOURS_OF_OPERATION,
  isClosed,
  getHoursOfOp,
};
