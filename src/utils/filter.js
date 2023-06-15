import { isPast, isFuture } from './event-date.js';

const TYPE_FILTER = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};


const filter = {
  [TYPE_FILTER.EVERYTHING]: (trip) => trip,
  [TYPE_FILTER.FUTURE]: (trip) => trip.filter((nowPoint) => isFuture(nowPoint.dateFrom, 'D') || isFuture(nowPoint.dateTo, 'D')),
  [TYPE_FILTER.PAST]: (trip) => trip.filter((nowPoint) => isPast(nowPoint.dateTo, 'D') || isPast(nowPoint.dateFrom, 'D')),
};

export {filter, TYPE_FILTER};
