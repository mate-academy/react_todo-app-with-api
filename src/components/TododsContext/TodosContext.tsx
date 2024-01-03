import React, { useEffect, useMemo, useState } from 'react';
import { FilterOption } from '../../types/FilterOption';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';

const initialTodos: Todo[] = [];
const userId = 12068;

interface TodosContextType {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filterOption: FilterOption,
  setFilterOption: (filterOption: FilterOption) => void,
  userId: number,
  errorMessage: string,
  setErrorMessage: (errorMessages: string) => void,
  loading: boolean,
  setLoading: (arg: boolean) => void,
  loadingTodoIds: number[],
  setLoadingTodoIds: React.Dispatch<React.SetStateAction<number[]>>,
}

export const TodosContext = React.createContext<TodosContextType>({
  todos: initialTodos,
  setTodos: () => {},
  filterOption: FilterOption.Active,
  setFilterOption: () => {},
  userId,
  errorMessage: '',
  setErrorMessage: () => {},
  loading: false,
  setLoading: () => {},
  loadingTodoIds: [],
  setLoadingTodoIds: () => {},
});

type Props = {
  children: React.ReactNode
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState(initialTodos);
  const [filterOption, setFilterOption]
  = useState<FilterOption>(FilterOption.All);
  const [errorMessage, setErrorMessage] = useState('');
  const USER_ID = 12068;
  const [loading, setLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

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
    userId,
    errorMessage,
    setErrorMessage,
    loading,
    setLoading,
    loadingTodoIds,
    setLoadingTodoIds,
  }), [todos, errorMessage, filterOption, loading, loadingTodoIds]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
