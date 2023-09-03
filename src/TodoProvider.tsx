import React, { useMemo, useState } from 'react';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';

type ContextProps = {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  filterType: Filter,
  setFilterType: (newType: Filter) => void,
  errorMessage: string,
  setErrorMessage: (error: string) => void,
  tempTodo: Todo | null,
  setTempTodo: (l: Todo | null) => void,
  toDelete: number[];
  setToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  toToggle: number[];
  setToToggle: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodosContext = React.createContext<ContextProps>({
  todos: [],
  setTodos: () => {},
  filterType: Filter.ALL,
  setFilterType: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  toDelete: [],
  setToDelete: () => {},
  toToggle: [],
  setToToggle: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const USER_ID = 11373;

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<Filter>(Filter.ALL);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [toDelete, setToDelete] = useState<number[]>([]);
  const [toToggle, setToToggle] = useState<number[]>([]);

  const value = useMemo(() => ({
    todos,
    setTodos,
    filterType,
    setFilterType,
    errorMessage,
    setErrorMessage,
    tempTodo,
    setTempTodo,
    toDelete,
    setToDelete,
    toToggle,
    setToToggle,
  }), [todos, filterType, errorMessage, tempTodo, toDelete, toToggle]);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
