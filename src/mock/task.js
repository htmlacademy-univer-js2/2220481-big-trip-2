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
  const o = {
    'id': getRandomInt(10),
    'title': 'Upgrade to a business class',
    'price': getRandomInt(10000),
  };
  return o;
};

export const generatePoint = () => (

  {
    'base_price': getRandomInt(10000),
    'date_from': '2019-07-10T22:55:56.845Z',
    'date_to': '2019-07-11T11:22:13.375Z',
    'destination': generateDestination(getRandomInt(100)),
    'id': getRandomInt(100),
    'is_favorite': false,
    'offers': generateOffers(),
    'type': generateType(),
  }

);
