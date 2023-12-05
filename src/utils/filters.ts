import { Status } from '../types/FilterOptions';

export const filters = [
  {
    id: 'FilterLinkAll',
    href: '/#',
    text: 'All',
    status: Status.All,
  },
  {
    id: 'FilterLinkActive',
    href: '#/active',
    text: 'Active',
    status: Status.Active,
  },
  {
    id: 'FilterLinkCompleted',
    href: '#/completed',
    text: 'Completed',
    status: Status.Completed,
  },
];
