import { ErrorMessage } from '../types/ErrorMessage';
import { FilterStatus } from '../types/FilterStatus';
import { LoadingStatus } from '../types/LoadingStatus';
import { State } from '../types/State';

export const INITIAL_STATE: State = {
  todos: [],
  newTodoInputRef: null,
  errorMessage: ErrorMessage.None,
  filteredBy: FilterStatus.All,
  tempTodo: null,
  shouldLoading: LoadingStatus.None,
};
