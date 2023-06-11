import EventTrip from '../view/event-view.js';
import TripEventEditView from '../view/event-edit-view.js';
import { render, replace, remove } from '../framework/render.js';
import { isEscapeOn, POINT_MODEL, UPDATE_TYPE, USER_ACTION } from '../utils/common.js';
import { sameDates } from '../utils/event-date.js';

export default class TripEventPresenter {
  #tripEvent;
  #pointModel;

  #tripEventsListContainer;
  #tripEventComponent;
  #editForm;

  #offersType;
  #destinations;
  #detinationNames;

  #changeData;
  #changePointMode;

  constructor(tripEventsListContainer, offersByType, destinations, destinationNames, changeData, changePointMode) {
    this.#tripEventsListContainer = tripEventsListContainer;

    this.#offersType = offersByType;
    this.#destinations = destinations;
    this.#detinationNames = destinationNames;

    this.#changeData = changeData;
    this.#changePointMode = changePointMode;

    this.#pointModel = POINT_MODEL.DEFAULT;

    this.#tripEventComponent = null;
    this.#editForm = null;
  }

  init(tripEvent) {
    this.#tripEvent = tripEvent;

    this.#renderTripEventComponent();
  }

  resetTripEventMode() {
    if(this.#pointModel === POINT_MODEL.EDITING) {
      this.#replaceForm();
    }
  }

  destroy() {
    remove(this.#tripEventComponent);
    remove(this.#editForm);
  }

  setDelete() {
    if(this.#pointModel === POINT_MODEL.EDITING) {
      this.#editForm.updateElement({
        isDeleting: true,
        isDisabled: true,
      });
    }
  }

  setSave() {
    if(this.#pointModel === POINT_MODEL.EDITING) {
      this.#editForm.updateElement({
        isSaving: true,
        isDisabled: true,
      });
    }
  }

  setAborte() {
    if(this.#pointModel === POINT_MODEL.EDITING) {
      this.#editForm.shake();
      return;
    }

    const resetEdit = () => {
      this.#editForm.updateElement({
        isSaving: false,
        isDeleting: false,
        isDisabled: false,
      });
    };

    this.#editForm.shake(resetEdit);
  }

  #renderTripEventComponent() {
    const previousEventComponent = this.#tripEventComponent;
    const previousEditFormComponent = this.#editForm;

    this.#tripEventComponent = new EventTrip(this.#tripEvent,
      this.#offersType.length ? this.#offersType.find((offer) => offer.type === this.#tripEvent.type).offers : [],
      this.#destinations.find((place) => place.id === this.#tripEvent.destination));

    this.#renderEditForm();

    this.#tripEventComponent.setFormOpenClick(this.#onOpenButtonClick);
    this.#tripEventComponent.setFavoriteButton(this.#onFavoriteChangeClick);

    if(previousEventComponent === null || previousEditFormComponent === null) {
      render(this.#tripEventComponent, this.#tripEventsListContainer);
      return;
    }
    if(this.#pointModel === POINT_MODEL.EDITING) {
      replace(this.#tripEventComponent, previousEditFormComponent);
      this.#pointModel = POINT_MODEL.DEFAULT;
    }


    if(this.#pointModel === POINT_MODEL.DEFAULT) {
      replace(this.#tripEventComponent, previousEventComponent);
    }

    remove(previousEventComponent);
    remove(previousEditFormComponent);
  }

  #renderEditForm() {
    this.#editForm = new TripEventEditView(this.#offersType, this.#destinations, this.#detinationNames, this.#tripEvent);

    this.#editForm.setFormSubmitHandler(this.#onFormSubmit);
    this.#editForm.setFormCloseClickHandler(this.#onCloseButtonClick);
    this.#editForm.setFormDeleteHandler(this.#onDeleteButtonClick);
  }

  #replacePoint() {
    replace(this.#editForm, this.#tripEventComponent);

    document.addEventListener('keydown', this.#onEscapeKeyDown);

    this.#changePointMode();
    this.#pointModel = POINT_MODEL.EDITING;
  }

  #replaceForm() {
    this.#editForm.reset(this.#tripEvent);
    replace(this.#tripEventComponent, this.#editForm);

    document.removeEventListener('keydown', this.#onEscapeKeyDown);

    this.#pointModel = POINT_MODEL.DEFAULT;
  }

  #onOpenButtonClick = () => {
    this.#replacePoint();
  };

  #onCloseButtonClick = () => {
    this.#replaceForm();
  };

  #onFormSubmit = (tripEvent) => {
    const isMinorUpdate = !sameDates(this.#tripEvent.dateFrom, tripEvent.dateFrom)
      || !sameDates(this.#tripEvent.dateTo, tripEvent.dateTo)
      || this.#tripEvent.startPrice !== tripEvent.startPrice;
    this.#changeData(USER_ACTION.UPDATE_TRIP_EVENT, isMinorUpdate ? UPDATE_TYPE.MINOR : UPDATE_TYPE.PATCH, tripEvent);
  };

  #onEscapeKeyDown = (evt) => {
    if(isEscapeOn(evt)) {
      evt.preventDefault();

      this.#editForm.reset(this.#tripEvent);
      this.#replaceForm();
    }
  };

  #onFavoriteChangeClick = () => {
    this.#changeData(USER_ACTION.UPDATE_TRIP_EVENT, UPDATE_TYPE.PATCH, {...this.#tripEvent, isFavorite: !this.#tripEvent.isFavorite});
  };

  #onDeleteButtonClick = (tripEvent) => {
    this.#changeData(USER_ACTION.DELETE_TRIP_EVENT, UPDATE_TYPE.MINOR, tripEvent);
  };
}