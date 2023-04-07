import { Filter } from '../types/Filter';
import { FilterLink } from '../types/FilterLink';

export const filterLinks: FilterLink[] = [
  { title: Filter.ALL, url: '' },
  { title: Filter.ACTIVE, url: 'active' },
  { title: Filter.COMPLETED, url: 'completed' },
];
