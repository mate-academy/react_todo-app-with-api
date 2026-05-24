import { FilterStatus } from '../types/FilterStatus';
import { Filter } from '../types/Filter';

export const FILTERS: readonly Filter[] = [
  { label: 'All', value: FilterStatus.All },
  { label: 'Active', value: FilterStatus.Active },
  { label: 'Completed', value: FilterStatus.Completed },
];
