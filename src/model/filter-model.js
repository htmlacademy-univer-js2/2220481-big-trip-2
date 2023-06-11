import Observable from '../framework/observable.js';
import { TYPE_FILTER } from '../utils/filter.js';

export default class FilterModel extends Observable {
  #filterType;

  constructor() {
    super();
    this.#filterType = TYPE_FILTER.EVERYTHING;
  }

  get filterType() {
    return this.#filterType;
  }

  setFilterType(updateType, filterType) {
    this.#filterType = filterType;
    this._notify(updateType, filterType);
  }
}