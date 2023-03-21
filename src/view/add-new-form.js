import { createElement } from '../render.js';

const createNewAddFormTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" >New event</button>'
);

export default class ListAddFormView {
  get template() {
    return createNewAddFormTemplate;
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

