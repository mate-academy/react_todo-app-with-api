import { FilterBy } from './FilterBy';

export interface TodoFilterProps {
  filterBy: FilterBy;
  handleFilterClick: (filterType: FilterBy) =>
  (event: React.MouseEvent) => void;
}
