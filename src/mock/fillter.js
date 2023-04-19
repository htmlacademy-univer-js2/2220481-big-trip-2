import { filter } from '../utils';

export const generateFilter = (tasks) => Object.entries(filter).map(
  ([filterName, filterTask]) => ({
    name: filterName,
    count: filterTask(tasks).length,
  })
) ;
