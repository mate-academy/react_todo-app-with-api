import { ErrorMessage } from './ErrorMessage';
import { Filter } from './Filter';
import { Todo } from './Todo';

export type Context = {
  todos: Todo[],
  tempTodo: Todo | null,
  getFilteredTodos: (filterType: Filter) => Todo[],
  addTodo: () => void,
  deleteTodo: (todoId: number) => void,
  setError: (error: ErrorMessage) => void,
  errorMessage: ErrorMessage,
  updateTodo: (todo: Todo) => Promise<Todo | void>,
  toggleAll: () => void,
  toggleTodo: (todo: Todo) => void,
  clearCompleted: () => void,
  todoCount: number,
  statusResponse: boolean,
  title: string,
  setTitle: (newTitle: string) => void,
  isUpdating: number[],
};
