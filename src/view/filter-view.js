import AbstractView from '../framework/view/abstract-view.js';

const cretaeFilterItemTemplate = (filter, currentFilterType) => {
  const {type, count} = filter;

  const checkedAttribute = type === currentFilterType ? 'checked' : '';
  const disabledAttribute = count === 0 ? 'disabled' : '';

  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${checkedAttribute} ${disabledAttribute}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
};

const createFilterTemplate = (filters, currentFilterType) => {
  const filterItmes = filters.map((filter) => cretaeFilterItemTemplate(filter, currentFilterType)).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItmes}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class FilterView extends AbstractView {
  #filters;
  #currentFilterType;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler(cb) {
    this._cb.filterTypeChange = cb;
    this.element.addEventListener('change', this.#onFilterTypeChange);
  }

  #onFilterTypeChange = (evt) => {
    evt.preventDefault();
    this._cb.filterTypeChange(evt.target.value);
  };
}