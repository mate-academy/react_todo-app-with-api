import { FilterBy } from './FilterBy';
import { Todo } from './Todo';

export interface TodoFooterProps {
  todos: Todo[];
  filterBy: FilterBy;
  handleFilterClick: (filterType: FilterBy) =>
  (event: React.MouseEvent) => void;
  clearCompletedTodos: () => void;
}
