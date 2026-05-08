import { FilterStatus } from './types/types';

export const FILTERS = [
  {
    id: 'all' as FilterStatus,
    title: 'All',
    url: '#/',
    cy: 'FilterLinkAll',
  },
  {
    id: 'active' as FilterStatus,
    title: 'Active',
    url: '#/active',
    cy: 'FilterLinkActive',
  },
  {
    id: 'completed' as FilterStatus,
    title: 'Completed',
    url: '#/completed',
    cy: 'FilterLinkCompleted',
  },
];
