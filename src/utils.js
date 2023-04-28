import dayjs from 'dayjs';
import { FilterType } from './mock/const';

const getRandomInt = (max) => Math.floor(Math.random() * max);

const doNormalDate = (date) => dayjs(date).format('D MMMM');

const doNormalTime = (date) => `${dayjs(date).format('H')}:${dayjs(date).format('mm')}`;

const doNormalDateForOffer = (date) => `${dayjs(date).format('MM/DD/YYYY')} ${doNormalTime(date)} `;

const isFutureOrPast = (task) => {
  const isToday = require('dayjs/plugin/isToday');

  dayjs.extend(isToday);

  const newData = task['date_from'];

  const a = newData.split('T')[0].split('-');

  const date = new Date(a[0], a[1], a[2]);


  return (dayjs(date).isAfter(dayjs()));


};


const filter ={
  [FilterType.EVERYTHING]: (tasks) => tasks,
  [FilterType.FUTURE]: (tasks) => tasks.filter(((task) => isFutureOrPast(task))),
  [FilterType.PAST]: (tasks) => tasks.filter(((task) => isFutureOrPast(task))),
};

const updateItem = (items, update) => {
  console.log(update)
  const index = items.findIndex((item) => item.id === update.id);
  if (index === -1){
    return items;
  }

  return [
    ...items.slice(0,index),
    update,
    ...items.slice(index + 1),
  ];
};

export {getRandomInt, doNormalDate, doNormalTime, doNormalDateForOffer, filter, updateItem};
