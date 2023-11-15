import { FILTER } from './FILTER';
import { Todo } from './Todo';

export type Context = {
  todos: Todo[];
  visibleTodos: Todo[];
  isUpdating: number[];
  title: string;
  errorMessage: string;
  activeTodos: number;
  statusResponce: boolean;
  currentFilter: FILTER;
  tempTodo: Todo | null;
  addTodo: () => void;
  setTitle: (title: string) => void;
  setError: (message: string) => void;
  setCurrentFilter: (filter: FILTER) => void;
  handlerClearCompletedTodos: () => void;
  toggleTodo: (newTodo: Todo) => void;
  deleteTodo: (todoId: number) => void;
  toggleAll: () => void;
  updateTodo: (todo: Todo) => Promise<void | Todo>;
};
