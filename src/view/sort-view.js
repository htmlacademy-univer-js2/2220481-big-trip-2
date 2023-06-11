import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPES } from '../utils/sort.js';

const createSort = (nowSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${Object.values(SORT_TYPES).map((sortType) => {
    const isChecked = sortType === nowSortType ? 'checked' : '';
    const isDisabled = sortType === SORT_TYPES.EVENT || sortType === SORT_TYPES.OFFER ? 'disabled' : '';
    

    return (
      `<div class="trip-sort__item  trip-sort__item--${sortType}">
        <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" data-sort-type="${sortType}" type="radio" name="trip-sort" value="sort-${sortType}" ${isDisabled} ${isChecked}>
        <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
      </div>`);}).join('')}
  </form>`
);

export default class SortClass extends AbstractView {
  #nowSortType;

  constructor(nowSortType) {
    super();
    this.#nowSortType = nowSortType;
  }

  get template() {
    return createSort(this.#nowSortType);
  }

  setSortTypeChangeHandler(cb) {
    this._cb.sortTypeChange = cb;

    this.element.addEventListener('click', this.#sortChange);
  }

  #sortChange = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._cb.sortTypeChange(evt.target.dataset.sortType);
  };
}