import { Status } from '../types/Status';

export const filters = [
  { href: '#/', status: Status.ALL, data: 'FilterLinkAll' },
  { href: '#/', status: Status.ACTIVE, data: 'FilterLinkActive' },
  {
    href: '#/completed',
    status: Status.COMPLETED,
    data: 'FilterLinkCompleted',
  },
];
