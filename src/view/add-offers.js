const MakeOffersList = (offers) =>{
  let allOffers = '';

  for(let i = 0; i<offers.length; i++){
    allOffers+=`<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" >
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${offers[i]['title']}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offers[i]['price']}</span>
        </label>
      </div>`;
  }
  return allOffers;
};

export {MakeOffersList};
