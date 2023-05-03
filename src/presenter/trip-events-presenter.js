import ListAddFormView from '../view/add-new-form.js';
import ListEditFormView from '../view/edit-form.js';
import ListSortView from '../view/list-sort-view.js';
import ListPointView from '../view/point-view.js';
import ListEventsView from '../view/trip-events-view.js';
import ListMessageEmpty from '../view/list-point-empty.js';
import PointPresenter from './point-presenter.js';
import { render } from '../render.js';
import { updateItem } from '../utils.js';


export default class TripEventsPresenter{
  #eventsList = null;  
  #tripContainer = null;  
  #pointsModel = null;  
  #tripPoints = null; 
  
  #pointPresenter = new Map()
   
  constructor() {
    this.#eventsList = new ListEventsView();
    this.#tripContainer = null;  
    this.#pointsModel = null;  
    this.#tripPoints = null;  
  }

  init (tripContainer, pointsModel){
    
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#tripPoints = [...this.#pointsModel.point];
    
    
    render(new ListSortView(), this.#tripContainer);
    render(this.#eventsList, this.#tripContainer);
    

    if(this.#tripPoints.length > 0){
      for(let i = 0; i<this.#tripPoints.length; i++){
      
      
        this.#renderPoint(this.#tripPoints[i]);
  
      }
    }
    else{
      render(new ListMessageEmpty, this.#tripContainer);
    }
  
  };
  #renderPoint = (point) => {
    
    const pointPresent = new PointPresenter(this.#eventsList, this.#pointChange, this.#handleModeChange )
    pointPresent.init(point)
    this.#pointPresenter.set(point.id, pointPresent)
    
  }

  #clearPointPresenter = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear()

  }

  #pointChange = (updatedTask) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedTask);
    this.#pointPresenter.get(updatedTask.id).init(updatedTask);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView())
  }
}
