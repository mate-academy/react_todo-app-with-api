import { Filter } from './Filter';
import { Todo } from './Todo';

export type State = {
  todos: Todo[];
  loadingTodos: Todo[];
  selectedTodo: null | Todo;
  tempTodo: null | Todo;
  filter: Filter;
  updatedAt: Date;
  errorMessage: string;
  loading: boolean;
};
