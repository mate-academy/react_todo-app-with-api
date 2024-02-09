import React, { useEffect, useMemo, useState } from 'react';
import { Filter } from '../types/Filter';
import { getTodos } from '../api/todos';
import { Todo } from '../types/Todo';

const initiatTodos: Todo[] = [];

interface TodosContext {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  filter: Filter;
  setFilter: (v: Filter) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  userId: number;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TodoContext = React.createContext<TodosContext>({
  todos: initiatTodos,
  setTodos: () => { },
  filter: Filter.Active,
  setFilter: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  userId: 11947,
  loading: false,
  setLoading: () => { },
});

interface Props {
  children: React.ReactNode;
}

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const USER_ID = 11947;
  const [todos, setTodos] = useState(initiatTodos);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTodos(USER_ID).then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const value = useMemo(() => ({
    todos,
    setTodos,
    filter,
    setFilter,
    errorMessage,
    setErrorMessage,
    userId: USER_ID,
    loading,
    setLoading,
  }), [todos, filter, errorMessage, loading]);

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
