import { FilterType } from './filterType';

export const FILTER_LINKS = [
  {
    type: FilterType.All,
    href: '#/',
    label: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    type: FilterType.Active,
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    type: FilterType.Completed,
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];
