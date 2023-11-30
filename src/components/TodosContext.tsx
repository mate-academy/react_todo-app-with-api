import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';
import { FilterOption } from '../types/FilterOption';

const initialTodos: Todo[] = [];

interface TodosContextType {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filterOption: FilterOption,
  setFilterOption: (filterOption: FilterOption) => void,
  userId: number,
  errorMessage: string,
  setErrorMessage: (errorMessage: string) => void,
}

export const TodosContext = React.createContext<TodosContextType>({
  todos: initialTodos,
  setTodos: () => { },
  filterOption: FilterOption.Active,
  setFilterOption: () => {},
  userId: 11981,
  errorMessage: '',
  setErrorMessage: () => { },
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState(initialTodos);
  const [filterOption, setFilterOption] = useState<FilterOption>(
    FilterOption.All,
  );
  const USER_ID = 11981;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    filterOption,
    setFilterOption,
    userId: USER_ID,
    errorMessage,
    setErrorMessage,
  }), [todos, filterOption, errorMessage]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
