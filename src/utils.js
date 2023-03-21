import dayjs from 'dayjs';

const getRandomInt = (max) => Math.floor(Math.random() * max);

const doNormalDate = (date) => dayjs(date).format('D MMMM');

const doNormalTime = (date) => `${dayjs(date).format('H')}:${dayjs(date).format('mm')}`;

const doNormalDateForOffer = (date) => `${dayjs(date).format('MM/DD/YYYY')} ${doNormalTime(date)} `;

export {getRandomInt, doNormalDate, doNormalTime, doNormalDateForOffer};
