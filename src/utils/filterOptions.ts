import { Status, FilterOption } from '../types/TodoStatusFilter';

export const TODO_STATUS_FILTER_OPTIONS: Record<Status, FilterOption> = {
  [Status.ALL]: {
    href: '/',
    testId: 'FilterLinkAll',
    text: 'All',
  },
  [Status.COMPLETED]: {
    href: '/completed',
    testId: 'FilterLinkCompleted',
    text: 'Completed',
  },
  [Status.ACTIVE]: {
    href: '/active',
    testId: 'FilterLinkActive',
    text: 'Active',
  },
};
