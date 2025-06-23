import { Filter } from '../../types/FilterType';

export const FiltersLabel = [
  { value: Filter.All, label: 'All', cy: 'FilterLinkAll' },
  { value: Filter.Active, label: 'Active', cy: 'FilterLinkActive' },
  { value: Filter.Completed, label: 'Completed', cy: 'FilterLinkCompleted' },
] as const;
