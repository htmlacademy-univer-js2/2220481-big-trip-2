import { createElement } from '../render.js';

const createMessageListEmptyTemplate = () => (
  `<main class="page-body__page-main  page-main">
  <div class="page-body__container">
    <section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>

      <p class="trip-events__msg">Click New Event to create your first point</p>

      <!--
        Значение отображаемого текста зависит от выбранного фильтра:
          * Everthing – 'Click New Event to create your first point'
          * Past — 'There are no past events now';
          * Future — 'There are no future events now'.
      -->
    </section>
  </div>
</main>`
);

export default class ListMessageEmpty {
  get template() {
    return createMessageListEmptyTemplate;
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
