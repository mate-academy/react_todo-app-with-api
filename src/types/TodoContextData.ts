import { ErrorType } from './ErrorType';
import { FilterType } from './FilterType';
import { Todo } from './Todo';

export interface TodoContextData {
  todoInputValue: string,
  setTodoInputValue: React.Dispatch<React.SetStateAction<string>>;
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  filterType: FilterType,
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
  deletedId: number | null;
  setDeletedId: React.Dispatch<React.SetStateAction<number | null>>;
  editedId: number | null;
  setEditedId: React.Dispatch<React.SetStateAction<number | null>>;
  areAllEdited: boolean;
  setAreAllEdited: React.Dispatch<React.SetStateAction<boolean>>;
  areCompletedDel: boolean;
  setCompletedDel: React.Dispatch<React.SetStateAction<boolean>>;
  isInputDisabled: boolean,
  setIsInputDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  isErrorShown: boolean,
  setIsErrorShown: React.Dispatch<React.SetStateAction<boolean>>;
  errorType: ErrorType,
  setErrorType: React.Dispatch<React.SetStateAction<ErrorType>>;
}
