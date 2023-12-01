import { ErrorTypes } from './ErrorTypes';
import { Filter } from './Filter';
import { Todo } from './Todo';

export interface Context {
  tempTodo: Todo | null;
  setTempTodo: (v: Todo) => void;
  todos: Todo[];
  setTodos: (v: Todo[]) => void;
  addTodo: (v: Omit<Todo, 'id'>) => Promise<void>;
  deleteTodo: (todoId: number) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  filter: Filter;
  setFilter: (filterBy: Filter) => void;
  errorType: ErrorTypes;
  setErrorType: (err: ErrorTypes) => void;
  loadingTodoIds: number[];
  setLoadingTodoIds: (v: number[]) => void;
}
