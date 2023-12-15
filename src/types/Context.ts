import { ErrorType } from './ErrorType';
import { FilterType } from './FilterType';
import { Todo } from './Todo';

export interface ContextState {
  selectedFilter: FilterType;
  errorMsg: ErrorType | null;
  tempTodo: Todo | null;
  globalLoading: boolean;
}

export interface Context {
  state: ContextState;
  changeState: <T>(field: ContextKey, value: T) => void;
  errorFound: (error: ErrorType) => void;
  todosFromServer: Todo[];
  setTodosFromServer: (value: Todo[] | ((prevVar: Todo[]) => Todo[])) => void;
  toggleAllActive: boolean;
}

export enum ContextKey {
  SelectedFilter = 'selectedFilter',
  ErrorMsg = 'errorMsg',
  TempTodo = 'tempTodo',
  GlobalLoading = 'globalLoading',
}
