import { Status } from './Status';
import { Todo } from './Todo';

export interface TodoContextType {
  todos: Todo[];
  filteredTodos: Todo[],
  tempTodo: Todo | null,
  errorMessage: string,
  updatingTodosIds: number[],
  addNewTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void,
  updateTodo: (todo: Omit<Todo, 'userId'>) => void,
  filter: Status;
  handleFilter: (status: Status) => void;
  handleUpdatingTodosIds: (id: number | null) => void,
  handleError: (error: string) => void;
  handleSetTempTodo: (todo: Todo | null) => void;
}
