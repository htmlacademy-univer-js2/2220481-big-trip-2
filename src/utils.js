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

export {getRandomInt, doNormalDate, doNormalTime, doNormalDateForOffer, filter};
