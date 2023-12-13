import { ErrorMessage } from './ErrorMessage';
import { Filter } from './Filter';
import { Todo } from './Todo';

export type Context = {
  todos: Todo[],
  tempTodo: Todo | null,
  getFilteredTodos: (filterType: Filter) => Todo[],
  addTodo: () => void,
  deleteTodo: (id: number) => void,
  setError: (error: ErrorMessage) => void,
  errorMessage: ErrorMessage,
  statusResponce: boolean,
  title: string,
  setTitle: (value: string) => void,
  toggleTodo: (todo: Todo) => void,
  updateTodo: (todo: Todo) => Promise<void | Todo>,
  toggleAll: () => void,
  clearCompleted: () => void,
  isUpdating: number[],
  todoCount: number,
};
