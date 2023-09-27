import { TodoStatus } from '../types/TodoStatus';

export const FILTER_LINKS = [
  {
    text: 'All',
    status: TodoStatus.All,
    dataCy: 'FilterLinkAll',
  },
  {
    text: 'Active',
    status: TodoStatus.Active,
    dataCy: 'FilterLinkActive',
  },
  {
    text: 'Completed',
    status: TodoStatus.Completed,
    dataCy: 'FilterLinkCompleted',
  },
];
