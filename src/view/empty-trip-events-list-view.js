import AbstractView from '../framework/view/abstract-view.js';
import { TYPE_FILTER } from '../utils/filter.js';

const MESSAGES_FILTER = {
  [TYPE_FILTER.EVERYTHING]: 'Click New Event to create your first point',
  [TYPE_FILTER.FUTURE]: 'There are no future events now',
  [TYPE_FILTER.PAST]: 'There are no past events now',
};

const createZeroFIlter = (filterType) => `<p class="trip-events__msg">${MESSAGES_FILTER[filterType]}</p>`;

export default class ZeroTripEventsClass extends AbstractView {
  #filterType;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createZeroFIlter(this.#filterType);
  }
}