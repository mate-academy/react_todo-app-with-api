import { Filter } from './Filter';
import { Todo } from './Todo';

export interface FooterProps {
  filter: Filter;
  todos: Todo[];
  setFilter: (filter: Filter) => void;
  handleClearCompleted: () => void;
}
