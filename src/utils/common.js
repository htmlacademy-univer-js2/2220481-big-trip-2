const POINT_MODEL = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const USER_ACTION = {
  ADD_TRIP_EVENT: 'ADD_TRIP_EVENT',
  UPDATE_TRIP_EVENT: 'UPDATE_TRIP_EVENT',
  DELETE_TRIP_EVENT: 'DELETE_TRIP_EVENT',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const isEscapeOn = (evt) => evt.key === 'Escape';

export {TYPES, isEscapeOn, POINT_MODEL, USER_ACTION, UPDATE_TYPE};
