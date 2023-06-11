import AbstractView from '../framework/view/abstract-view.js';

const createLoadMes = () => '<p class="trip-events__msg">Loading...</p>';

export default class LoadClassView extends AbstractView {
  get template() {
    return createLoadMes();
  }
}
