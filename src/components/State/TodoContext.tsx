import React, { useEffect, useMemo, useState } from 'react';
import { getTodos } from '../../api/todos';
import { USER_ID } from '../../utils/userId';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { ContextProvider } from '../../types/ContextProvider';

type Props = {
  children: React.ReactNode;
};

export const TodoContext = React.createContext<ContextProvider>({
  todos: [],
  setTodos: () => {},
  status: Status.All,
  setStatus: () => {},
  isFocused: false,
  setIsFocused: () => {},
  isError: false,
  setIsError: () => {},
  errorText: '',
  setErrorText: () => {},
  query: '',
  setQuery: () => {},
  tempToDo: null,
  setTempToDo: () => {},
  handleDeleteTodoId: [],
  setHandleDeleteTodoId: () => {},
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.All);
  const [isFocused, setIsFocused] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [tempToDo, setTempToDo] = useState<Todo | null>(null);
  const [handleDeleteTodoId, setHandleDeleteTodoId] = useState<number[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setIsError(true);
        setErrorText('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setIsError(false);
    }, 3000);

    return () => clearTimeout(errorTimeout);
  }, [isError]);

  const value = useMemo(() => ({
    todos,
    setTodos,
    status,
    setStatus,
    isFocused,
    setIsFocused,
    isError,
    setIsError,
    errorText,
    setErrorText,
    tempToDo,
    setTempToDo,
    handleDeleteTodoId,
    setHandleDeleteTodoId,
    query,
    setQuery,
  }), [errorText,
    isError,
    isFocused,
    status,
    tempToDo,
    todos,
    handleDeleteTodoId,
    query,
  ]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
