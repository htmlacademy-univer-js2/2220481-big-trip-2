import AbstractView from '../framework/view/abstract-view.js';
import { POINT_MODEL } from '../utils/common.js';
import { ToGoodTime, getDeltaTime } from '../utils/event-date.js';

const createTrip = (tripEvent, offersByCType, destination) => {
  const {startPrice, dateFrom, dateTo, isFavorite, offers, type} = tripEvent;

  const isFavoriteButton = isFavorite ? 'event__favorite-btn--active' : '';

  const deltaTime = getDeltaTime(dateFrom, dateTo);

  const eventOffersType = offers.length && offersByCType.length ? offersByCType.map((offer) => {
    if (!offers.includes(offer.id)) {
        return '';
    }
    return `<li class="event__offer">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
            </li>`;
}).join('') : '';

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${ToGoodTime(dateFrom, 'YYYY-MM-DD')}">${ToGoodTime(dateFrom, 'MMM D')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${ToGoodTime(dateFrom, 'YYYY-MM-DD[T]HH:mm')}">${ToGoodTime(dateFrom, 'HH:mm')}</time>
            &mdash;
            <time class="event__end-time" datetime="${ToGoodTime(dateTo, 'YYYY-MM-DD[T]HH:mm')}">${ToGoodTime(dateTo, 'HH:mm')}</time>
          </p>
          <p class="event__duration">${deltaTime}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${startPrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${eventOffersType}
        </ul>
        <button class="event__favorite-btn ${isFavoriteButton}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
};

export default class EventTrip extends AbstractView {
  #tripEvent;
  #offersByCType;
  #destination;

  constructor(tripEvent, offersByCType, destination) {
    super();
    this.#tripEvent = tripEvent;
    this.#offersByCType = offersByCType;
    this.#destination = destination;
    this.pointMode = POINT_MODEL.DEFAULT;
  }

  get template() {
    return createTrip(this.#tripEvent, this.#offersByCType, this.#destination);
  }

  setFormOpenClick(cb) {
    this._cb.formOpenClick = cb;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onOpenPointClick);
  }  
  #onOpenPointClick = (evt) => {
    evt.preventDefault()
    this._cb.formOpenClick();
  };

  setFavoriteButton(cb) {
    this._cb.favoriteClick = cb;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#onFavoriteClick);
  }
  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._cb.favoriteClick();
  };
}