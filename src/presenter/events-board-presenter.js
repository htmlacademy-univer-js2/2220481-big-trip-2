import SortClass from '../view/sort-view.js';
import TripEventsList from '../view/events-list-view.js';
import LoadClassView from '../view/loading-view.js';
import ErrorMesClass from '../view/error-meassage-view.js';
import ZeroTripEventsClass from '../view/empty-trip-events-list-view.js';
import TripEventPresenter from './trip-event-presenter.js';
import TripEventNewPresenter from './event-new-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { remove, render } from '../framework/render.js';
import { TYPE_FILTER, filter } from '../utils/filter.js';
import { SORT_TYPES, sortEvents } from '../utils/sort.js';
import { USER_ACTION, UPDATE_TYPE } from '../utils/common.js';

const LIMIT_TIME = {
  MAX_LIMIT: 1000,
  MIN_LIMIT: 350,
  
};

export default class TripEventsPresenter {
  #tripEventsModel;
  
  #tripEventsComponent;
  
  #tripEventsList;
  
  #tripEventsPresenters;
  
  #tripEventNewPresenter;

  #modelOfferse;
  #modelOfDestination;

  #sortComponent;
  #nowSortType;

  #modelOfFilter;
  #EventsMes = null;

  
  #loadComponent;
  #isLoading;
  #errorMessageComponent;
  #uiBlocker;

  constructor(tripEventsComponent, tripEventsModel, offersModel, destinationModel, modelOfFilterl) {
    this.#tripEventsModel = tripEventsModel;

    this.#modelOfferse = offersModel;
    this.#modelOfDestination = destinationModel;

    this.#tripEventsComponent = tripEventsComponent;
    this.#tripEventsList = new TripEventsList();

    this.#tripEventsPresenters = new Map();

    this.#modelOfFilter = modelOfFilterl;

    this.#sortComponent = null;
    this.#nowSortType = SORT_TYPES.DAY;

    this.#loadComponent = new LoadClassView();
    this.#isLoading = true;

    this.#errorMessageComponent = new ErrorMesClass();
    this.#uiBlocker = new UiBlocker(LIMIT_TIME.MIN_LIMIT, LIMIT_TIME.MAX_LIMIT);

    this.#tripEventsModel.addObserver(this.#onDataChange);
    this.#modelOfFilter.addObserver(this.#onDataChange);

    this.#modelOfferse.addObserver(this.#onDataChange);
    this.#modelOfDestination.addObserver(this.#onDataChange);
  }

  init() {
    this.#renderBoard();
  }

  get tripEvents() {
    const filtedEvents = filter[this.#modelOfFilter.filterType]([...this.#tripEventsModel.tripEvents]);
    return sortEvents[this.#nowSortType](filtedEvents);
  }

  createTrip(destroyCallback) {
    this.#nowSortType = SORT_TYPES.DAY;
    this.#modelOfFilter.setFilterType(UPDATE_TYPE.MAJOR, TYPE_FILTER.EVERYTHING);
    this.#tripEventNewPresenter.init(destroyCallback);
  }

  #renderBoard() {
    if(this.#isLoading) {
      this.renderLoadMEs();
      return;
    }

    if(!this.tripEvents.length) {
      this.renderZeroEventsMes();
      return;
    }

    this.#renderSort();
    this.#renderTripEventsList();
  }

  renderLoadMEs() {
    render(this.#loadComponent, this.#tripEventsComponent);
  }

  renderZeroEventsMes() {
    this.#EventsMes = new ZeroTripEventsClass(this.#modelOfFilter.filterType);
    render(this.#EventsMes, this.#tripEventsComponent);
  }

  #renderErrorMes() {
    render(this.#errorMessageComponent, this.#tripEventsComponent);
  }

  #renderSort() {
    this.#sortComponent = new SortClass(this.#nowSortType);

    this.#sortComponent.setSortTypeChangeHandler(this.#sortChange);
    render(this.#sortComponent, this.#tripEventsComponent);
  }

  #renderTripEventsList() {
    render(this.#tripEventsList, this.#tripEventsComponent);

    this.#renderTripEvents();
  }

  #renderTripEvents() {
    this.tripEvents.forEach((tripEvent) => this.#renderTripEvent(tripEvent));
  }

  #renderTripEvent(tripEvent) {
    const tripEventPresenter = new TripEventPresenter(this.#tripEventsList.element, this.#modelOfferse.offersByType,
      this.#modelOfDestination.destinations, this.#modelOfDestination.destinationNames, this.#viewAction, this.#onEventChange);
    tripEventPresenter.init(tripEvent);
    this.#tripEventsPresenters.set(tripEvent.id, tripEventPresenter);
  }

  #resetBoard(sortType) {
    this.#tripEventNewPresenter.destroy();
    this.#tripEventsPresenters.forEach((point) => point.destroy());
    this.#tripEventsPresenters.clear();

    remove(this.#EventsMes);
    remove(this.#sortComponent);
    remove(this.#loadComponent);
    

    if(this.#EventsMes) {
      remove(this.#EventsMes);
    }

    this.#nowSortType = sortType;
  }

  #viewAction = async (userType, newType, update) => {
    this.#uiBlocker.block();

    switch(userType) {
      case USER_ACTION.UPDATE_TRIP_EVENT:
        this.#tripEventsPresenters.get(update.id).setSave();

        try {
          await this.#tripEventsModel.updateTripEvent(newType, update);
        } catch(err) {
          this.#tripEventsPresenters.get(update.id).setAborte();
        }
        break;
      case USER_ACTION.ADD_TRIP_EVENT:
        this.#tripEventNewPresenter.setSave();

        try {
          await this.#tripEventsModel.addTripEvent(newType, update);
        } catch(err) {
          this.#tripEventNewPresenter.setAborte();
        }
        break;
      case USER_ACTION.DELETE_TRIP_EVENT:
        this.#tripEventsPresenters.get(update.id).setDelete();

        try {
          await this.#tripEventsModel.deleteTripEvent(newType, update);
        } catch(err) {
          this.#tripEventsPresenters.get(update.id).setAborte();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onDataChange = (newType, update) => {
    switch(newType) {
      case UPDATE_TYPE.MINOR:
        this.#resetBoard(this.#nowSortType);
        this.#renderBoard();
        break;

      case UPDATE_TYPE.PATCH:
        this.#tripEventsPresenters.get(update.id).init(update);
        break;
      
      case UPDATE_TYPE.MAJOR:
        this.#resetBoard(SORT_TYPES.DAY);
        this.#renderBoard();
        break;
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        remove(this.#loadComponent);

        if(!this.#modelOfDestination.destinations.length || !this.#modelOfferse.offersByType.length) {
          this.#renderErrorMes();
          break;
        }

        this.#tripEventNewPresenter = new TripEventNewPresenter(this.#tripEventsList.element, this.#modelOfferse.offersByType,
          this.#modelOfDestination.destinations, this.#modelOfDestination.destinationNames, this.#viewAction);

        this.#renderBoard();
        break;
    }
  };

  #sortChange = (sortType) => {
    if(sortType === this.#nowSortType) {
      return;
    }
    this.#resetBoard(sortType);
    this.#renderBoard();
  };

  #onEventChange = () => {
    this.#tripEventNewPresenter.destroy();

    this.#tripEventsPresenters.forEach((tripEvent) => tripEvent.resetTripEventMode());
  };
}