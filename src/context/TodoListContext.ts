import { createContext } from 'react';
import { TodoContextData } from '../types/TodoContextData';
import { FilterType } from '../types/FilterType';
import { ErrorType } from '../types/ErrorType';

export const TodoListContext = createContext<TodoContextData>({
  todoInputValue: '',
  setTodoInputValue: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  filterType: FilterType.ALL,
  setFilterType: () => {},
  deletedId: null,
  setDeletedId: () => {},
  editedId: null,
  setEditedId: () => {},
  areAllEdited: false,
  setAreAllEdited: () => {},
  areCompletedDel: false,
  setCompletedDel: () => {},
  isInputDisabled: false,
  setIsInputDisabled: () => {},
  isErrorShown: false,
  setIsErrorShown: () => {},
  errorType: ErrorType.NONE,
  setErrorType: () => {},
});
