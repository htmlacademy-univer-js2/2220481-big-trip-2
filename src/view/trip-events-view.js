import { createElement } from '../render.js';
import AbstractView from '../framework/view/abstract-view.js';
const createNewEventsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListEventsView  extends AbstractView{
  get template() {
    return createNewEventsTemplate();
  }
}

