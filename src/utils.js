import dayjs from 'dayjs';

const getRandomInt = (max) => Math.floor(Math.random() * max);

const doNormalDate = (date) => dayjs(date).format('D MMMM');

export {getRandomInt, doNormalDate};
