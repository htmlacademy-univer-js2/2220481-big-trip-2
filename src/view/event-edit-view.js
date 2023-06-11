import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPES } from '../utils/common.js';
import { ToGoodTime, isPast } from '../utils/event-date.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const upperFirstSymbol = (word) => word.charAt(0).toUpperCase() + word.slice(1);

const createTripEventOffersTemplate = (tripEvent, offersByType, disabledTag) => {
  const {offers} = tripEvent;

  if(offersByType.length) {
    const eventOffersType = offersByType.map((offer) => {
      const checked = offers.includes(offer.id) ? 'checked' : '';

      const titleClass = offer.title.toLowerCase().replace(' ', '-');

      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleClass}-1" data-offer-title="${offer.title}" type="checkbox" name="event-offer-${titleClass}" ${checked} ${disabledTag}>
          <label class="event__offer-label" for="event-offer-${titleClass}-1">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </label>
        </div>`
      );
    }).join('');

    return(
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
          ${eventOffersType}
        </div>
      </section>`
    );
  }
  return '<section class="event__section  event__section--offers"></section>';
};

const createTripEventDestinationsTemplate = (destination) => {
  if(destination.description.length || destination.pictures.length) {
    const pictures = destination.pictures.map((picture) =>
      `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

    return(
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${pictures}
          </div>
        </div>
      </section>`
    );
  }
  return '<section class="event__section  event__section--destination"></section>';
};

const createEventTypeFields = (currentType) => (
  Array.from(TYPES, (eventType) => {
    const isChecked = eventType === currentType ? 'checked' : '';
    return (`<div class="event__type-item">
                  <input id="event-type-${eventType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked}>
                  <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${upperFirstSymbol(eventType)}</label>
                </div>`);
  }).join('')
);

const createTripEventEditTemplate = (tripEvent, offersByType, destinations, destinationsNames,isNewEvent) => {
  const {startPrice, dateFrom, dateTo, destination, type, isSaving, isDeleting, isDisabled} = tripEvent;

  const rollUpButton = isNewEvent ? '' :
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;

  const currentDestination = destinations.find((place) => place.id === destination);

  const disabledTag = isDisabled ? 'disabled' : '';
  const deleteMessage = isDeleting ? 'Deleting...' : 'Delete';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${disabledTag}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createEventTypeFields(type)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${currentDestination.name}" list="destination-list-1" autocomplete="off" ${disabledTag}>
            <datalist id="destination-list-1">
              ${Array.from(destinationsNames, (place) => `<option value="${place}"></option>`).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ToGoodTime(dateFrom, 'DD/MM/YY HH:mm')}" ${disabledTag}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ToGoodTime(dateTo, 'DD/MM/YY HH:mm')}" ${disabledTag}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${startPrice}" ${disabledTag}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${disabledTag}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${disabledTag}>${isNewEvent ? 'Cancel' : deleteMessage}</button>
          ${rollUpButton}
        </header>
        <section class="event__details">
          ${createTripEventOffersTemplate(tripEvent, offersByType, disabledTag)}
          ${createTripEventDestinationsTemplate(currentDestination)}
        </section>
      </form>
    </li>`
  );
};

export default class TripEventEditView extends AbstractStatefulView {
  #offersType;
  #offersByCType;

  #destinations;
  #destinationsNames;

  #dateFromPicker;
  #dateToPicker;

  #isNewEvent;

  constructor(offersByType, destinations, destinationsNames, tripEvent, isNewEvent = false) {
    super();
    this._state = TripEventEditView.parseTripEventToState(tripEvent);

    this.#offersType = offersByType;
    this.#offersByCType = this.#offersType.length ? this.#offersType.find((offer) => offer.type === tripEvent.type).offers : [];

    this.#destinations = destinations;
    this.#destinationsNames = destinationsNames;

    this.#dateFromPicker = null;
    this.#dateToPicker = null;

    this.#isNewEvent = isNewEvent;

    this.#setInnerHandlers();

    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  get template() {
    return createTripEventEditTemplate(this._state, this.#offersByCType, this.#destinations, this.#destinationsNames, this.#isNewEvent);
  }

  removeElement() {
    super.removeElement();

    if(this.#dateFromPicker && this.#dateToPicker) {
      this.#dateFromPicker.destroy();
      this.#dateToPicker.destroy();

      this.#dateFromPicker = null;
      this.#dateToPicker = null;
    }
  }

  setFormSubmitHandler(cb) {
    this._cb.formSubmit = cb;

    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
  }

  setFormDeleteHandler(cb) {
    this._cb.formDelete = cb;

    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onFormDeleteClick);
  }

  setFormCloseClickHandler(cb) {
    this._cb.formCloseClick = cb;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onFormCloseClick);
  }

  reset(tripEvent) {
    this.#updateOffersByCurrentType(tripEvent.type);

    this.updateElement({
      offers: tripEvent.offers,
    });

    this.updateElement(TripEventEditView.parseTripEventToState(tripEvent));
  }

  _restoreHandlers() {
    this.#setInnerHandlers();

    this.#setDateFromPicker();
    this.#setDateToPicker();

    this.setFormSubmitHandler(this._cb.formSubmit);
    if(!this.#isNewEvent) {
      this.setFormCloseClickHandler(this._cb.formCloseClick);
    }
    this.setFormDeleteHandler(this._cb.formDelete);
  }

  #updateOffersByCurrentType(newType) {
    this.#offersByCType = this.#offersType.length ? this.#offersType.find((offer) => offer.type === newType).offers : [];
  }

  #setInnerHandlers() {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#onEventTypeClick);
    this.element.querySelector('#event-destination-1').addEventListener('change', this.#onEventPlaceChange);

    if(this.#offersType.length && this.#offersByCType.length) {
      this.element.querySelector('.event__available-offers').addEventListener('click', this.#onOfferClick);
    }

    this.element.querySelector('#event-price-1').addEventListener('input', this.#onPriceInput);
  }

  #setDateFromPicker() {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        minDate: dayjs().toString(),
        minuteIncrement: 1,
        onChange: this.#onDateFromChange,
      });
  }

  #setDateToPicker() {
    this.#dateToPicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        minuteIncrement: 1,
        onChange: this.#onDateToChange,
      }
    );
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();

    this._cb.formSubmit(TripEventEditView.parseStateToTripEvent(this._state));
  };

  #onFormCloseClick = (evt) => {
    evt.preventDefault();

    this._cb.formCloseClick();
  };

  #onFormDeleteClick = (evt) => {
    evt.preventDefault();

    this._cb.formDelete(TripEventEditView.parseStateToTripEvent(this._state));
  };

  #onEventTypeClick = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    this.#updateOffersByCurrentType(evt.target.value);

    this.updateElement({
      type: evt.target.value,
    });
  };

  #onEventPlaceChange = (evt) => {
    if(!this.#destinationsNames.includes(evt.target.value)) {
      return;
    }

    evt.preventDefault();

    this.updateElement({
      destination: this.#destinations.find((place) => place.name === evt.target.value).id,
    });
  };

  #onOfferClick = (evt) => {
    if(evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    const newOffer = this.#offersByCType.find((offer) => offer.title === evt.target.dataset.offerTitle).id;

    if(this._state.offers.includes(newOffer)) {
      this._state.offers.splice(this._state.offers.indexOf(newOffer), 1);
    } else {
      this._state.offers.push(newOffer);
    }

    this.updateElement({
      offers: this._state.offers,
    });
  };

  #onPriceInput = (evt) => {
    evt.preventDefault();

    this._setState({
      startPrice: Math.abs(Number(evt.target.value.replace(/[^\d]/g, ''))),
    });
  };

  #onDateFromChange = ([newDate]) => {
    this.updateElement({
      dateFrom: newDate,
      dateTo: isPast(this._state.dateTo, '', newDate) ? newDate : this._state.dateTo,
    });
  };

  #onDateToChange = ([newDate]) => {
    this.updateElement({
      dateTo: newDate,
    });
  };

  static parseTripEventToState(tripEvent) {
    return {...tripEvent,
      isSaving: false,
      isDeleting: false,
      isDisabled: false,
    };
  }

  static parseStateToTripEvent(state) {
    const tripEvent = {...state};

    delete tripEvent.isSaving;
    delete tripEvent.isDeleting;
    delete tripEvent.isDisabled;

    return tripEvent;
  }
}