import TripEventEditView from '../view/event-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { isEscapeOn, UPDATE_TYPE, USER_ACTION, TYPES } from '../utils/common.js';
import dayjs from 'dayjs';

export default class TripEventNewPresenter {
  #tripEventsListContainer;
  #addFormComponent = null;
  #offersType;
  #destinations;
  #destinationNames;
  #changeData;
  #destroyCallback = null;

  constructor(tripEventsListContainer, offersByType, destinations, destinationNames, changeData) {
    this.#tripEventsListContainer = tripEventsListContainer;

    this.#offersType = offersByType;
    this.#destinations = destinations;
    this.#destinationNames = destinationNames;

    this.#changeData = changeData;
  }

  init(destroyCallback) {
    this.#destroyCallback = destroyCallback;

    this.#renderAddComponent();
  }

  destroy() {
    if(this.#addFormComponent === null) {
      remove(this.#addFormComponent);
    }

    this.#destroyCallback?.();

    remove(this.#addFormComponent);
    this.#addFormComponent = null;

    document.removeEventListener('keydown', this.#onEscapeKeyDown);
  }

  setSave() {
    this.#addFormComponent.updateElement({
      isSaving: true,
      isDisabled: true,
    });
  }

  setAborte() {
    const resetAddFormState = () => {
      this.#addFormComponent.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      });
    };

    this.#addFormComponent.shake(resetAddFormState);
  }

  #renderAddComponent() {
    if(this.#addFormComponent !== null) {
      return;
    }

    this.#addFormComponent = new TripEventEditView(this.#offersType, this.#destinations,
      this.#destinationNames, this.#generateDefaultEvent(), true);

    this.#addFormComponent.setFormSubmitHandler(this.#onFormSubmit);
    this.#addFormComponent.setFormDeleteHandler(this.#onCancelButtonClick);

    render(this.#addFormComponent, this.#tripEventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscapeKeyDown);
  }

  #generateDefaultEvent() {
    return {
      startPrice: 0,
      dateFrom: dayjs().toString(),
      dateTo: dayjs().toString(),
      destination: this.#destinations[0].id,
      isFavorite: false,
      offers: [],
      type: TYPES[0],
    };
  }

  #onFormSubmit = (tripEvent) => {
    this.#changeData(USER_ACTION.ADD_TRIP_EVENT, UPDATE_TYPE.MINOR, tripEvent);
  };

  #onEscapeKeyDown = (evt) => {
    if(isEscapeOn(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onCancelButtonClick = () => {
    this.destroy();
  };
}