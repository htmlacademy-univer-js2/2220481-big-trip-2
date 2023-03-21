import { createElement } from '../render.js';

const createNewEventsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListEventsView {
  get template() {
    return createNewEventsTemplate;
  }

  get elements() {
    if(!this.element){
      this.element = createElement(this.template);
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

