import { ErrorMessages } from './Errors';
import { Todo } from './Todo';

export interface DeletingParams {
  currentTodos: Todo[];
  activeTodos: Todo[];
  addLoading: (ids: number | number[]) => void;
  deleteLoading: (ids: number | number[]) => void;
  onTodoDeleting: (todos: Todo[]) => void;
  onError: (errorMessages: ErrorMessages) => void;
}
