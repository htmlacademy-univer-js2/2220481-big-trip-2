import ListPointView from "../view/point-view"
import ListEditFormView from "../view/edit-form"
import { render} from '../render.js';
import { replace,remove } from "../framework/render";

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
    #pointComponent = null
    #editPointComponent = null
    #eventlist = null
    #changeData = null
    #point = null
    #mode = MODE.DEFAULT;
    #changeMode = null

    constructor(eventlist, changeData, changeMode){
        this.#eventlist = eventlist
        this.#changeData = changeData
        this.#changeMode  =changeMode
    }

    init = (point) => {
        this.#point = point
        const prevPoint = this.#pointComponent
        const prevEditPoint = this.#editPointComponent

        this.#pointComponent = new ListPointView(point);
        this.#editPointComponent = new ListEditFormView(point);

        

        
        //this.#editPointComponent.setSubmitHandler(this.#onEditFormSubmit)
        
        this.#editPointComponent.setClickHandler(this.#onFormCloseButClick)
        this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick)
        this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit)
        this.#pointComponent.setClickHandler(this.#handleEditClick);
        if (prevPoint === null || prevEditPoint === null){
          render(this.#pointComponent,this.#eventlist.element);
          return;
        }
        
        if(this.#mode === MODE.DEFAULT){
          replace(this.#pointComponent, prevPoint)
        }

        if(this.#mode === MODE.EDITING){
          replace(this.#editPointComponent, prevEditPoint)
        }
        remove(prevPoint)
        remove(prevEditPoint)

        
    };

    destroy = () =>{
      remove(this.#pointComponent)
      remove(this.#editPointComponent)
    };
    
    resetViev = () =>{
      if(this.#mode !== MODE.DEFAULT){
        this.#replaceEditingPointToPreviewPoint();
      }
    }

    #replaceEventListChildren = (newChild, oldChild) => {
        this.#eventlist.element.replaceChild(newChild, oldChild);
      }
    #onEscKeyDown = (evt) => {
        if(evt.key === 'Escape' || evt.key ==='Esc' ){
          evt.preventDefault();
          this.#replaceEventListChildren(this.#pointComponent.element,this.#editPointComponent.element);
          document.removeEventListener('keydown', this.#onEscKeyDown);
        }
      };
    #onFormOpenButClick = () => {
      this.#replaceEventListChildren(this.#editPointComponent.element, this.#pointComponent.element );
        document.addEventListener('keydown', this.#onEscKeyDown);
      }
  
    #onFormCloseButClick = () => {
      this.#replaceEventListChildren(this.#pointComponent.element,this.#editPointComponent.element);
        document.removeEventListener('keydown', this.#onEscKeyDown);
      }
  
    #onEditFormSubmit = () => {
        evt.preventDefault();
        this.#onFormCloseButClick();
      } 
    
    #handleFavoriteClick = () => {
      
      this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
    };

    #handleFormSubmit = (task) => {
      this.#changeData(task);
      this.#replaceEditingPointToPreviewPoint()
    }
    #replacePreviewPointToEditingPoint = () => {
      replace(this.#editPointComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#onEscKeyDown);
      this.#changeMode();
      this.#mode = MODE.EDITING;
    };

    #replaceEditingPointToPreviewPoint = () => {
      replace(this.#pointComponent, this.#editPointComponent);
      document.removeEventListener('keydown', this.#onEscKeyDown);
      this.#mode = MODE.DEFAULT;
    };
    resetView = () => {
      if (this.#mode !== MODE.PREVIEW) {
        this.#replaceEditingPointToPreviewPoint();
      }
    };
    #handleEditClick = () => {
      this.#replacePreviewPointToEditingPoint();
    };

}