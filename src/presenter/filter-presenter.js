import FilterView from '../view/filter-view.js';
import TripInfo from '../view/info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { SORT_TYPES, sortEvents } from '../utils/sort.js';
import { UPDATE_TYPE } from '../utils/common.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer;

  #tripInfoComponent = null;
  #tripInfoContainer;

  #modelOfFilter;
  #tripEventModel;

  #modelOfferse;
  #destinationsModel;

  constructor(filterContainer, tripInfoContainer, filterModel, tripEventModel, offersModel, destinationsModel) {
    this.#filterContainer = filterContainer;
    this.#tripInfoContainer = tripInfoContainer;

    this.#modelOfFilter = filterModel;
    this.#tripEventModel = tripEventModel;

    this.#modelOfferse = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#modelOfFilter.addObserver(this.#onDataChange);
    this.#tripEventModel.addObserver(this.#onDataChange);
  }

  get filter() {
    return Array.from(Object.entries(filter), ([filterType, filterEvents]) => ({
      type: filterType,
      count: filterEvents(this.#tripEventModel.tripEvents).length,
    }));
  }

  get tripEvents() {
    return sortEvents[SORT_TYPES.DAY](this.#tripEventModel.tripEvents);
  }

  init() {
    const previousFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(this.filter, this.#modelOfFilter.filterType);
    this.#filterComponent.setFilterTypeChangeHandler(this.#onFilterTypeChange);

    this.#renderTripInfo();

    if(!previousFilterComponent) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, previousFilterComponent);
    remove(previousFilterComponent);
  }

  #renderTripInfo() {
    const previousInfoComponent = this.#tripInfoComponent;

    const tripEvents = this.tripEvents;

    if(tripEvents.length && this.#modelOfferse.offersByType.length && this.#destinationsModel.destinations.length) {
      this.#tripInfoComponent = new TripInfo(tripEvents, this.#getTripPrice(tripEvents), this.#destinationsModel.destinations);
    }

    if(previousInfoComponent) {
      replace(this.#tripInfoComponent, previousInfoComponent);
      remove(previousInfoComponent);
    } else if (this.#tripInfoComponent) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #getTripPrice(tripEvents) {
    let sum = 0;

    tripEvents.forEach((point) => {
      sum += point.startPrice;

      const nowOff = this.#modelOfferse.offersByType.find((offer) => offer.type === point.type).offers;

      point.offers.forEach((offer) => {
        sum += nowOff.find((currentOffer) => currentOffer.id === offer).price;
      });
    });

    return sum;
  }

  #onDataChange = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if(this.#modelOfFilter.filterType === filterType) {
      return;
    }

    this.#modelOfFilter.setFilterType(UPDATE_TYPE.MAJOR, filterType);
  };
}