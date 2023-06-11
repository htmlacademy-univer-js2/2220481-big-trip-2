import AbstractView from '../framework/view/abstract-view.js';

const createErrorMes = () => (
  `<p class="trip-events__msg">Some data couldn't be loaded.<br>
  Please, try to reload this page or visit it later.</p>`
);

export default class ErrorMesClass extends AbstractView {
  get template() {
    return createErrorMes();
  }
}
