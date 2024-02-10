import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

const inLoadingTodos: number[] = [];
const USER_ID = 11993;

type ContextValue = {
  error: string,
  setError: (error: string) => void,
  todoList: Todo[],
  setTodoList: (todos: Todo[]) => void,
  isLoading: boolean,
  setIsLoading: (value: boolean) => void,
  USER_ID: number,
  inLoadingTodos: number[],
  filterStatus: Status,
  setFilterStatus: (value: Status) => void,
};

export const PageContext = React.createContext<ContextValue>({
  error: '',
  setError: () => {},
  todoList: [],
  setTodoList: () => {},
  isLoading: false,
  setIsLoading: () => {},
  USER_ID,
  inLoadingTodos: [],
  filterStatus: Status.all,
  setFilterStatus: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [error, setError] = useState('');
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(Status.all);

  useEffect(() => debounce(() => setError(''), 3000), [setError, error]);

  const providerValue = {
    error,
    setError,
    todoList,
    setTodoList,
    isLoading,
    setIsLoading,
    USER_ID,
    inLoadingTodos,
    filterStatus,
    setFilterStatus,
  };

  return (
    <PageContext.Provider value={providerValue}>
      {children}
    </PageContext.Provider>
  );
};
