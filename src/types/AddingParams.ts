import { ErrorMessages } from './Errors';
import { Todo } from './Todo';

export interface AddingParams {
  currentTodos: Todo[];
  newTodoTitle: string;
  userId: number;
  onTempTodoAdd: (todo: Todo | null) => void;
  onTodoAdding: (todos: Todo[]) => void;
  onError: (errorMessage: ErrorMessages) => void;
}
