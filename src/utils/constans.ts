import { FilterType } from '../types/FilterType';

export const filterHrefByType = {
  [FilterType.All]: '#/',
  [FilterType.Active]: '#/active',
  [FilterType.Completed]: '#/completed',
};

export const filterTypeList = Object.values(FilterType);
