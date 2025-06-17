import { Filter } from '../types/Filter';

export const FILTERS = [
  { label: 'All', value: Filter.All, href: '#/', dataCy: 'FilterLinkAll' },
  {
    label: 'Active',
    value: Filter.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: Filter.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];
