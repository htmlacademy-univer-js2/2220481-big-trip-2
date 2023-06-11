import dayjs from 'dayjs';


const HOUR_IN_DAY = 24;
const MIN_IN_HOUR = 60;
const isPast = (date, unit, dateFrom = dayjs()) => dayjs(dateFrom).isAfter(dayjs(date), unit);

const isFuture = (date, unit) => dayjs().isBefore(dayjs(date), unit) || dayjs().isSame(dayjs(date), unit);

const sortDates = (currentEvent, nextEvent) => {
  const dateFromDifference = dayjs(currentEvent.dateFrom).diff(dayjs(nextEvent.dateFrom));

  return dateFromDifference === 0 ? dayjs(nextEvent.dateTo).diff(dayjs(currentEvent.dateTo)) : dateFromDifference;
};

const sortDuration = (currentEvent, nextEvent) => dayjs(nextEvent.dateTo).diff(dayjs(nextEvent.dateFrom)) - dayjs(currentEvent.dateTo).diff(dayjs(currentEvent.dateFrom));

const sameDates = (oldDate, newDate) => dayjs(oldDate).isSame(dayjs(newDate));

const ToGoodTime = (dateTime, format) => dayjs(dateTime).format(format).toUpperCase();

const refactorTime = (time) => {
  let format = 'DD[D] HH[H] mm[M]';
  if (time / MIN_IN_HOUR < HOUR_IN_DAY) {
    format = 'HH[H] mm[M]';
  }

  else if(time < MIN_IN_HOUR){
    format = 'mm[M]';
  }
  return ToGoodTime(dayjs()
    .date(time / (MIN_IN_HOUR * HOUR_IN_DAY))
    .hour((time / MIN_IN_HOUR) % HOUR_IN_DAY)
    .minute(time % MIN_IN_HOUR), format);
};

const getDeltaTime = (dateFrom, dateTo) => refactorTime(dayjs(dateTo).diff(dayjs(dateFrom), 'minute'));

export {ToGoodTime, getDeltaTime, isPast, isFuture, sortDates, sortDuration, sameDates};