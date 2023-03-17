import { getRandomInt } from '../utils';

const generateType = () => {
  const type = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
  return type[getRandomInt(type.length)];
};

const generateDestination = (id) => {
  const description = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    ' Cras aliquet varius magna, non porta ligula feugiat eget',
    ' Fusce tristique felis at fermentum pharetra',
    ' Aliquam id orci ut lectus varius viverra',
    ' Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante',
    ' Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum',
    ' Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
    ' Sed sed nisi sed augue convallis suscipit in sed felis',
    ' Aliquam erat volutpat',
    ' Nunc fermentum tortor ac porta dapibus',
    ' In rutrum ac purus sit amet tempus',
  ];
  const name = ['Paris', 'Tokyo', 'Aboba', 'Moscow', 'Ekanterenburg'];


  const d = {
    'id': id,
    'description': description[getRandomInt(description.length)],
    'name': name[getRandomInt(name.length)],
    'pictures': [
      {
        'src': `http://picsum.photos/300/200?r=${id}`,
        'description': description[getRandomInt(description.length)]
      }
    ]
  };
  return d;
};

const generateOffers = () => {
  const offers = [ 'Upgrade to a business class', 'New transport', 'Dinner', 'Guide'];
  const o = {
    'id': getRandomInt(10),
    'title': offers[getRandomInt(offers.length)],
    'price': getRandomInt(10000),
  };
  return o;
};
const generateData = () => {
  const newData = `2019-${getRandomInt(31)}-${getRandomInt(12)}T${getRandomInt(24)}:${getRandomInt(60)}:${getRandomInt(60)}`;
  return newData;
};

const isFavorite = () =>{
  if (getRandomInt(2) == 1){
    return true;
  }
  return false;
};

export const generatePoint = () => (
  {
    'base_price': getRandomInt(10000),
    'date_from': generateData(),
    'date_to': generateData(),
    'destination': generateDestination(getRandomInt(100)),
    'id': getRandomInt(100),
    'is_favorite': isFavorite(),
    'offers': generateOffers(),
    'type': generateType(),
  }

);
