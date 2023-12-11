import { ErrorMessage } from './ErrorMessage';
import { FilterStatus } from './FilterStatus';
import { LoadingStatus } from './LoadingStatus';
import { Todo } from './Todo';

export interface State {
  todos: Todo[],
  newTodoInputRef: HTMLInputElement | null,
  errorMessage: ErrorMessage,
  filteredBy: FilterStatus,
  tempTodo: Todo | null,
  shouldLoading: LoadingStatus,
}
