import AbstractView from '../framework/view/abstract-view.js';
import {ToGoodTime } from '../utils/event-date.js';

const TWO_EVENTS = 2;
const THREE_EVENTS = 3;

const getTripsTitle = (tripEvents, destinations) => {
  const startPoint = destinations.find((place) => place.id === tripEvents[0].destination).name;
  const endPoint = destinations.find((place) => place.id === tripEvents[tripEvents.length - 1].destination).name;
  switch(tripEvents.length) {
    case 1:
      return startPoint;

    case TWO_EVENTS:
      return `${startPoint} &mdash; ${endPoint}`;

    case THREE_EVENTS:
      return `${startPoint} &mdash; ${destinations.find((place) => place.id === tripEvents[1].destination).name} &mdash; ${endPoint}`;

    default:
      return `${startPoint} &mdash; . . . &mdash; ${endPoint}`;
  }
};

const createTripInfo = (tripEvents, tripPrice, destinations) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripsTitle(tripEvents, destinations)}</h1>
      <p class="trip-info__dates">${ToGoodTime(tripEvents[0].dateFrom, 'MMM D')}&nbsp;&mdash;&nbsp;${ToGoodTime(tripEvents[tripEvents.length - 1].dateTo, 'MMM D')}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripPrice}</span>
    </p>
  </section>`
);

export default class TripInfo extends AbstractView {
  #events;
  #tripPrice;
  #destinations;

  constructor(tripEvents, tripPrice, destinations) {
    super();
    this.#events = tripEvents;
    this.#tripPrice = tripPrice;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfo(this.#events, this.#tripPrice, this.#destinations);
  }
}