import { createElement } from '../render.js';
import { doNormalDate, doNormalTime } from '../utils.js';
import AbstractView from '../framework/view/abstract-view.js';
const createNewPointTemplate = (task) => {
  const date = task['date_from'] !== null
    ? doNormalDate(task['date_from'])
    : 'Дата неизвестна';
  const dateTo = task['date_to'] !== null
    ? doNormalTime(task['date_to'])
    : 'Дата неизвестна';
  const dateFrom = task['date_from'] !== null
    ? doNormalTime(task['date_from'])
    : 'Дата неизвестна';

  const isActive = task['is_favorite'] === true
    ? 'active'
    : 'noactive';
  return `<div class="event">
  <time class="event__date" datetime="2019-03-18">${date.slice(0,6)}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src=${task['destination']['pictures'][0]['src']} alt="Event type icon">
  </div>
  <h3 class="event__title">${task['type']} ${task['destination']['name']}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="2019-03-18T10:30">${dateFrom}</time>
      &mdash;
      <time class="event__end-time" datetime="2019-03-18T11:00">${dateTo}</time>
    </p>
    <p class="event__duration">30M</p>
  </div> 
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${task['base_price']}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    <li class="event__offer">
      <span class="event__offer-title">${task['offers'][0]['title']}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${task['offers'][0]['price']}</span>
    </li>
  </ul>
  <button class="event__favorite-btn event__favorite-btn--${isActive}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>`;
};
export default class ListPointView extends AbstractView{
  #task = null

  constructor(task){
    super()
    this.#task = task
  } 

  get template(){
    return createNewPointTemplate(this.#task);
    
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler)

  }

  #clickHandler = (evt) => {
    evt.preventDefault();

    this._callback.click()
  }
}






