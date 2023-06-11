import Observable from '../framework/observable.js';
import { UPDATE_TYPE } from '../utils/common.js';

export default class TripEventsModel extends Observable {
  #tripEventApiService;
  #events = [];

  constructor(tripEventApiService) {
    super();
    this.#tripEventApiService = tripEventApiService;
  }

  async init () {
    try {
      const tripEvents = await this.#tripEventApiService.tripEvents;
      this.#events = tripEvents.map(this.#adToClient);
    } catch(err) {
      this.#events = [];
    }

    this._notify(UPDATE_TYPE.INIT);
  }

  get tripEvents() {
    return this.#events;
  }

  async addTripEvent(updateType, newItem) {
    try {
      const response = await this.#tripEventApiService.createTrip(newItem);
      const newTripEvent = this.#adToClient(response);

      this.#events = [newTripEvent, ...this.#events];

      this._notify(updateType, newItem);
    } catch(err) {
      throw new Error('Can\'t add trip event');
    }
  }

  async updateTripEvent(updateType, updatedItem) {
    const updatedItemIndex = this.#events.findIndex((item) => item.id === updatedItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t update unexisting trip event');
    }

    try {
      const response = await this.#tripEventApiService.updateTripEvent(updatedItem);
      const updatedTripEvent = this.#adToClient(response);

      this.#events = [...this.#events.slice(0, updatedItemIndex), updatedTripEvent, ...this.#events.slice(updatedItemIndex + 1)];

      this._notify(updateType, updatedTripEvent);
    } catch(err) {
      throw new Error('Can\'t update trip event');
    }
  }

  async deleteTripEvent(updateType, deletingItem) {
    const updatedItemIndex = this.#events.findIndex((item) => item.id === deletingItem.id);

    if(updatedItemIndex === -1) {
      throw new Error('Can\'t delete unexisting trip event');
    }

    try {
      await this.#tripEventApiService.deleteTripEvent(deletingItem);
      this.#events = [...this.#events.slice(0, updatedItemIndex), ...this.#events.slice(updatedItemIndex + 1)];

      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete trip event');
    }
  }

  #adToClient(tripEvent) {
    const adaptedTripEvent = {...tripEvent,
      startPrice: tripEvent['base_price'],
      dateFrom: tripEvent['date_from'],
      dateTo: tripEvent['date_to'],
      isFavorite: tripEvent['is_favorite'],
    };

    delete adaptedTripEvent['base_price'];
    delete adaptedTripEvent['date_from'];
    delete adaptedTripEvent['is_favorite'];
    delete adaptedTripEvent['date_to'];
    return adaptedTripEvent;
  }
}