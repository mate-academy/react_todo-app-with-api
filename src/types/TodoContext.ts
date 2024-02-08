import { Status } from './Status';
import { Todo } from './Todo';

export interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[],
  filterField: Status;
  updatingTodosIds: number[],
  errorMessage: string,
  tempTodo: Todo | null,
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void,
  updateTodo: (todo: Omit<Todo, 'userId'>) => void,
  handleFilterField: (status: Status) => void;
  handleUpdatingTodosIds: (id: number | null) => void,
  handleError: (error: string) => void;
  handleSetTempTodo: (todo: Todo | null) => void;
}
