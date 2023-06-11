import Observable from '../framework/observable.js';

export default class OfferByTypeModel extends Observable {
  #tripEventApiService;
  #offersType = [];

  constructor(tripEventApiService) {
    super();
    this.#tripEventApiService = tripEventApiService;
  }

  async init() {
    try {
      this.#offersType = await this.#tripEventApiService.offersByType;
    } catch(err) {
      this.#offersType = [];
    }
  }

  get offersByType() {
    return this.#offersType;
  }
}