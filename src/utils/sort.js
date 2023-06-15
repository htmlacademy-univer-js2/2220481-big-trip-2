import { sortDates, sortDuration } from './event-date.js';

const SORT_TYPES = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const sortEvents = {
  [SORT_TYPES.TIME]: (tripEvents) => tripEvents.sort(sortDuration),
  [SORT_TYPES.DAY]: (tripEvents) => tripEvents.sort(sortDates),
  [SORT_TYPES.PRICE]: (tripEvents) => tripEvents.sort((now, next) => next.startPrice - now.startPrice),
};

export {SORT_TYPES, sortEvents};
