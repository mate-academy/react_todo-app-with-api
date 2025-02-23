import { ErrorMessages } from './Errors';
import { Todo } from './Todo';

export interface TitleChangeParams {
  currentTodos: Todo[];
  currentTodo: Todo;
  newTitle: string;
  addLoading: (ids: number | number[]) => void;
  deleteLoading: (ids: number | number[]) => void;
  onTodosUpdating: (todos: Todo[]) => void;
  onError: (errorMessage: ErrorMessages) => void;
}
