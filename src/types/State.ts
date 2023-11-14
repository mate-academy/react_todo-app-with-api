import { Filter } from './Filter';
import { Todo } from './Todo';
import { TodoError } from './TodoError';

export interface State {
  initialTodos: Todo[];
  selectedFilter: Filter;
  tempTodo: Todo | null;
  loadingItemsId: number[];
  isSubmitting: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  todoError: TodoError;
}
