import React, { useCallback, useMemo, useState } from 'react';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

interface IContextValue {
  userId: number,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  activeTodos: Todo[],
  completedTodosIds: number[],
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  showError: (errorText: string) => void,
  loadingTodosIds: number[],
  setLoadingTodosIds: React.Dispatch<React.SetStateAction<number[]>>,
  currentFilterType: FilterType,
  setCurrentFilterType: React.Dispatch<React.SetStateAction<FilterType>>,
}

export const AppContext = React.createContext<IContextValue>({
  userId: 0,
  todos: [],
  setTodos: () => {},
  activeTodos: [],
  completedTodosIds: [],
  tempTodo: null,
  setTempTodo: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  showError: () => {},
  loadingTodosIds: [0],
  setLoadingTodosIds: () => {},
  currentFilterType: FilterType.All,
  setCurrentFilterType: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const AppProvider: React.FC<Props> = ({ children }) => {
  const userId = useMemo(() => 6826, []);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([0]);
  const [
    currentFilterType,
    setCurrentFilterType,
  ] = useState<FilterType>(FilterType.All);

  const activeTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const completedTodosIds = useMemo(() => (
    todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id)
  ), [todos]);

  const showError = useCallback((errorText: string) => {
    setErrorMessage(errorText);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, []);

  const contextValue = useMemo(() => {
    return {
      userId,
      todos,
      setTodos,
      activeTodos,
      completedTodosIds,
      tempTodo,
      setTempTodo,
      errorMessage,
      setErrorMessage,
      showError,
      loadingTodosIds,
      setLoadingTodosIds,
      currentFilterType,
      setCurrentFilterType,
    };
  }, [
    userId,
    todos,
    tempTodo,
    errorMessage,
    currentFilterType,
    loadingTodosIds,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
