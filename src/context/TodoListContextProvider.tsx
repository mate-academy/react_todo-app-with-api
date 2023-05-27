import { ReactNode, useState } from 'react';
import { TodoListContext } from './TodoListContext';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/ErrorType';

type Props = {
  children: ReactNode;
};

export const TodoListContextProvider: React.FC<Props> = ({ children }) => {
  const [todoInputValue, setTodoInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterType, setFilterType] = useState(FilterType.ALL);
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const [editedId, setEditedId] = useState<number | null>(null);
  const [areAllEdited, setAreAllEdited] = useState(false);
  const [areCompletedDel, setCompletedDel] = useState(false);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isErrorShown, setIsErrorShown] = useState(false);
  const [errorType, setErrorType] = useState(ErrorType.NONE);

  const contextValue = {
    todoInputValue,
    setTodoInputValue,
    tempTodo,
    setTempTodo,
    filterType,
    setFilterType,
    deletedId,
    setDeletedId,
    editedId,
    setEditedId,
    areAllEdited,
    setAreAllEdited,
    areCompletedDel,
    setCompletedDel,
    isInputDisabled,
    setIsInputDisabled,
    isErrorShown,
    setIsErrorShown,
    errorType,
    setErrorType,
  };

  return (
    <TodoListContext.Provider value={contextValue}>
      {children}
    </TodoListContext.Provider>
  );
};
