import { createElement } from '../render.js';
import AbstractView from '../framework/view/abstract-view.js';
const createNewAddFormTemplate = () => (
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" >New event</button>'
);

export default class ListAddFormView extends AbstractView{
  get template() {
    return createNewAddFormTemplate();
  }
}

