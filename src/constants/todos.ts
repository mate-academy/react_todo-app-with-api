import { Filter } from '../types/Filter';

export const API_URL = 'https://mate.academy/students-api/todos';
export const USER_ID = 4203;
export const RESPONSE_DELAY = 300;

export enum ErrorMessage {
  Load = 'Unable to load todos',
  EmptyTitle = 'Title should not be empty',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
}

export const FILTERS: Filter[] = ['all', 'active', 'completed'];

export const FILTER_TITLES: Record<Filter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

export const FILTER_DATA_CY: Record<Filter, string> = {
  all: 'FilterLinkAll',
  active: 'FilterLinkActive',
  completed: 'FilterLinkCompleted',
};

export const FILTER_HREFS: Record<Filter, string> = {
  all: '#/',
  active: '#/active',
  completed: '#/completed',
};
