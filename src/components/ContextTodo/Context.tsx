import React, {
  createContext, useEffect, useMemo, useState,
} from 'react';
import {
  ErrorMessage, Todo, TodoContext, TodoFilter,
} from '../../types';
import { USER_ID } from '../../utils/constant';
import { getTodos } from '../../api/todos';

export const ContextTodo = createContext<TodoContext>({
  todos: [],
  setTodos: () => { },
  filterBy: TodoFilter.All,
  setFilterBy: () => { },
  errorMessage: ErrorMessage.NothingError,
  setErrorMessage: () => { },
  tempTodo: null,
  setTempTodo: () => { },
  loadingTodoIds: [],
  setLoadingTodoIds: () => { },
});

type Props = {
  children: React.ReactNode
};

export const ProviderTodo: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const [filterBy, setFilterBy] = useState(TodoFilter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadError);
      });
  }, []);

  const preparedValues = useMemo(() => ({
    todos,
    setTodos,
    filterBy,
    setFilterBy,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    loadingTodoIds,
    setLoadingTodoIds,
  }), [todos,
    filterBy,
    setTodos,
    errorMessage,
    tempTodo,
    loadingTodoIds,
  ]);

  return (
    <ContextTodo.Provider value={preparedValues}>
      {children}
    </ContextTodo.Provider>
  );
};
