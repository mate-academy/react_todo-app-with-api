import { ErrorMessages } from './Errors';
import { Todo } from './Todo';

export interface CheckUpdatingParams {
  currentTodos: Todo[];
  addLoading: (ids: number | number[]) => void;
  deleteLoading: (ids: number | number[]) => void;
  onTodoUpdating: (todos: Todo[]) => void;
  onError: (errorMessages: ErrorMessages) => void;
}
