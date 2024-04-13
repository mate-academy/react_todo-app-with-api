import { Filter } from './Filter';
import { Todo } from './Todo';

export interface TodoContextType {
  todos: Todo[];
  filter: Filter;
  updatingTodosIds: number[];
  errorMessage: string;
  tempTodo: Todo | null;
  addTodoHandler: (todo: Todo) => void;
  deleteTodoHandler: (id: number) => void;
  updateTodoHandler: (todo: Omit<Todo, 'userId'>) => void;
  setFilterHandler: (status: Filter) => void;
  setUpdatingTodosIdsHandler: (id: number | null) => void;
  setErrorHandler: (error: string) => void;
  setTempTodoHandler: (todo: Todo | null) => void;
}
