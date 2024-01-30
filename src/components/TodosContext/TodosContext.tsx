import React, { useEffect, useState } from 'react';
import { ContextProps } from '../../types/ContextProps';
import { Todo } from '../../types/Todo';
import { FilterItem } from '../../types/FilterItem';
import { getTodos } from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessages';

export const TodosContext = React.createContext<ContextProps>({
  todos: [],
  setTodos: () => { },
  filter: FilterItem.All,
  setFilter: () => { },
  errorMessage: ErrorMessage.DEFAULT,
  handleErrorMessage: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  isLoadingAll: false,
  setIsLoadingAll: () => { },
  isChangedStatus: null,
  setIsChangedStatus: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const USER_ID = 37;

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterItem.All);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.DEFAULT);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isChangedStatus, setIsChangedStatus] = useState<boolean | null>(null);

  const handleErrorMessage = (error: ErrorMessage) => {
    setErrorMessage(error);

    setTimeout(setErrorMessage, 3000, ErrorMessage.DEFAULT);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => handleErrorMessage(ErrorMessage.UNABLE_LOAD));
  }, []);

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        filter,
        setFilter,
        errorMessage,
        handleErrorMessage,
        tempTodo,
        setTempTodo,
        isLoadingAll,
        setIsLoadingAll,
        isChangedStatus,
        setIsChangedStatus,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
