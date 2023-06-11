import ApiService from './framework/api-service.js';

const METHOD = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class TripEventApiService extends ApiService {
  get tripEvents() {
    return this._load({url: 'points'}).then(ApiService.parseResponse);
  }

  get offersByType() {
    return this._load({url: 'offers'}).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'}).then(ApiService.parseResponse);
  }

  async updateTripEvent(tripEvent) {
    const response = await this._load({
      url: `points/${tripEvent.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(this.#adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponce = await ApiService.parseResponse(response);
    return parsedResponce;
  }

  async createTrip(tripEvent) {
    const response = await this._load({
      url: 'points',
      method: METHOD.POST,
      body: JSON.stringify(this.#adaptToServer(tripEvent)),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parsedResponce = await ApiService.parseResponse(response);
    return parsedResponce;
  }

  async deleteTripEvent(tripEvent) {
    const response = await this._load({
      url: `points/${tripEvent.id}`,
      method: METHOD.DELETE,
    });

    return response;
  }

  #adaptToServer(tripEvent) {
    const adaptedTripEvent = {...tripEvent,
      'base_price': tripEvent.startPrice,
      'date_from': tripEvent.dateFrom,
      'date_to': tripEvent.dateTo,
      'is_favorite': tripEvent.isFavorite,
    };
    delete adaptedTripEvent.isFavorite;
    delete adaptedTripEvent.startPrice;
    delete adaptedTripEvent.dateFrom;
    delete adaptedTripEvent.dateTo;
    

    return adaptedTripEvent;
  }
}