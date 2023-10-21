import React, { useState, useEffect, useContext } from 'react';

import { getTodos } from '../api/todos';

import { FilterParams } from '../types/FilterParams';
import { ErrorMessages } from '../types/ErrorMessages';
import { Todo } from '../types/Todo';
import { USER_ID } from './user';
import { getFilteredTodos } from './TodosFilter';

interface TodosContextInterface {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,

  filteredTodos: Todo[],

  errorMessage: ErrorMessages,
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorMessages>>,

  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,

  filterParam: FilterParams,
  setFilterParam: React.Dispatch<React.SetStateAction<FilterParams>>,

  isCompletedTodosCleared: boolean,
  setIsCompletedTodosCleared: React.Dispatch<React.SetStateAction<boolean>>,

  loadingTodos: number[],
  setLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodosContext = React.createContext<TodosContextInterface>({
  todos: [],
  setTodos: () => {},

  filteredTodos: [],

  errorMessage: ErrorMessages.Default,
  setErrorMessage: () => {},

  tempTodo: null,
  setTempTodo: () => {},

  filterParam: FilterParams.All,
  setFilterParam: () => {},

  isCompletedTodosCleared: false,
  setIsCompletedTodosCleared: () => {},

  loadingTodos: [],
  setLoadingTodos: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessages>(ErrorMessages.Default);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);

  const [filterParam, setFilterParam]
  = useState<FilterParams>(FilterParams.All);

  const [isCompletedTodosCleared, setIsCompletedTodosCleared] = useState(false);

  const filteredTodos = getFilteredTodos(todos, filterParam);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessages.UnableToLoad));
  }, []);

  const value = {
    todos,
    setTodos,

    filteredTodos,

    errorMessage,
    setErrorMessage,

    tempTodo,
    setTempTodo,

    filterParam,
    setFilterParam,

    isCompletedTodosCleared,
    setIsCompletedTodosCleared,

    loadingTodos,
    setLoadingTodos,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const UseTodosContext = () => {
  const context = useContext(TodosContext);

  return context;
};
