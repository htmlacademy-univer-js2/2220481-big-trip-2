import ListFilterView from './view/list-filter-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import { render } from './render.js';
import pointsModel from './model/task-model.js';
import { generateFilter } from './mock/fillter.js';
const siteHeader = document.querySelector('.trip-main');
const siteMain = document.querySelector('.page-main');
const tripPresenter = new TripEventsPresenter();
const pointModel = new pointsModel();
const filters = generateFilter(pointModel.point);

render(new ListFilterView(filters), siteHeader.querySelector('.trip-controls__filters'));


tripPresenter.init(siteMain.querySelector('.trip-events'), pointModel);


