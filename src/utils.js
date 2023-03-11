import dayjs from 'dayjs';

const getRandomInt = (max) => Math.floor(Math.random() * max);

const doNormalDate = (date) => dayjs(date).format('D MMMM');

const doNormalTime = (date) => `${dayjs(date).format('HH')}:${dayjs(date).format('mm')}`;

export {getRandomInt, doNormalDate, doNormalTime};
