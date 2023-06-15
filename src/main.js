import TripEventsPresenter from './presenter/events-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripEventsModel from './model/trip-events-model.js';
import OfferByTypeModel from './model/offer-model.js';
import TripEventDestinationModel from './model/trip-event-destination-model.js';
import FilterModel from './model/filter-model.js';
import TripEventApiService from './trip-event-api-service.js';

const POINT = 'https://18.ecmascript.pages.academy/big-trip';
const AUTH_TOKEN = 'Basic rfa6wq786sg599ww3';

const tripMain = document.querySelector('.trip-main');
const newEventButton = tripMain.querySelector('.trip-main__event-add-btn');
const onFormClose = () => {
  newEventButton.disabled = false;
};
const filter = tripMain.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');

const filterModel = new FilterModel();

const tripEventApi = new TripEventApiService(POINT, AUTH_TOKEN);
const offerByType = new OfferByTypeModel(tripEventApi);
const destination = new TripEventDestinationModel(tripEventApi);
const tripEvent = new TripEventsModel(tripEventApi);


const tripEventsPresenter = new TripEventsPresenter(tripEvents, tripEvent,
  offerByType, destination, filterModel);

const filterPresenter = new FilterPresenter(filter, tripMain, filterModel,
  tripEvent, offerByType, destination);

const onNewEventClick = () => {
  newEventButton.disabled = true;
  tripEventsPresenter.createTrip(onFormClose);
};

filterPresenter.init();
tripEventsPresenter.init();

offerByType.init().finally(() => {
  destination.init().finally(() => {
    tripEvent.init().finally(() => {
      if(destination.destinations.length && offerByType.offersByType.length) {
        newEventButton.addEventListener('click', onNewEventClick);
      }
    });
  });
});
