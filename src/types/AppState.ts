import { Todo } from './Todo';
import { Errors } from './Errors';
import { Filter } from './Filter';

export type AppState = {
  todos: Todo[];
  error: Errors;
  filter: Filter;
  loadingTodos: number[];
  tempTodo: Todo | null;
};
