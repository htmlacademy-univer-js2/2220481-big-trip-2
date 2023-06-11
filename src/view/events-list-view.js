import AbstractView from '../framework/view/abstract-view.js';

const createTripEventsList = () => '<ul class="trip-events__list"></ul>';

export default class EventTrip extends AbstractView {
  get template() {
    return createTripEventsList();
  }
}
