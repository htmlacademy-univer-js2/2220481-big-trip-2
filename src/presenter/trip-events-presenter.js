import ListAddFormView from '../view/add-new-form.js';
import ListEditFormView from '../view/edit-form.js';
import ListSortView from '../view/list-sort-view.js';
import ListPointView from '../view/point-view.js';
import ListEventsView from '../view/trip-events-view.js';
import ListMessageEmpty from '../view/list-point-empty.js';
import { render } from '../render.js';

export default class TripEventsPresenter{
  #eventsList = null;  
  #tripContainer = null;  
  #pointsModel = null;  
  #tripPoints = null;  
   
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
    const pointComponent = new ListPointView(point);
    const editPointComponent = new ListEditFormView(point);
    render(pointComponent,this.#eventsList.element)

    const replaceEventListChildren = (newChild, oldChild) => {
      this.#eventsList.element.replaceChild(newChild, oldChild);
    }
    const onEscKeyDown = (evt) => {
      if(evt.key === 'Escape' || evt.key ==='Esc' ){
        evt.preventDefault();
        replaceEventListChildren(pointComponent.element,editPointComponent.element);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    const onFormOpenButClick = () => {
      replaceEventListChildren(editPointComponent.element, pointComponent.element );
      document.addEventListener('keydown', onEscKeyDown);
    }

    const onFormCloseButClick = () => {
      replaceEventListChildren(pointComponent.element,editPointComponent.element);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    const onEditFormSubmit = () => {
      evt.preventDefault();
      onFormCloseButClick();
    }

    
    editPointComponent.setSubmitHandler(onEditFormSubmit)
    pointComponent.setClickHandler(onFormOpenButClick)
    editPointComponent.setClickHandler(onFormCloseButClick)
    


  }
}
