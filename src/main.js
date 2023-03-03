import ListFilterView from './view/list-filter-view.js';
import TripEventsPresenter from './presenter/trip-events-presenter.js';
import { render } from './render.js';

const siteHeader = document.querySelector('.trip-main');
const siteMain = document.querySelector('.page-main');
const tripPresenter = new TripEventsPresenter();

render(new ListFilterView(), siteHeader.querySelector('.trip-controls__filters'));

tripPresenter.init(siteMain.querySelector('.trip-events'));

