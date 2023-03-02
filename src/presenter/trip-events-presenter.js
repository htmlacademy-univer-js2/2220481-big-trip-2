import ListAddFormView from '../view/add-new-form.js';
import ListEditFormView from '../view/edit-form.js';
import ListSortView from '../view/list-sort-view.js';
import ListPointView from '../view/point-view.js';
import ListEventsView from '../view/trip-events-view.js';
import { render } from '../render.js';

export default class TripEventsPresenter{
  constructor() {
    this.eventsList = new ListEventsView();
  }

  init (tripContainer){
    this.tripContainer = tripContainer;

    render(new ListSortView(), this.tripContainer);
    render(this.eventsList, this.tripContainer);
    render(new ListEditFormView(), this.eventsList.getElement());

    for(let i = 0; i<3; i++){
      render(new ListPointView(), this.eventsList.getElement());
    }

    render(new ListAddFormView(), this.eventsList.getElement());
  }
}
