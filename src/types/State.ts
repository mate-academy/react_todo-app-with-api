import { Filter } from './Filter';
import { Todo } from './Todo';

export interface State {
  todos: Todo[];
  errorMessage: string;
  filter: Filter;
  tempTodo: null | Todo;
  shouldFocus: Date | null;
  toggleAll: boolean;
}
