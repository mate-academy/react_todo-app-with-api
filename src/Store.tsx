import React, { useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoWithLoader } from './types/TodoWithLoader';
import { State } from './types/State';
import { Setters } from './types/Setters';
type InitialCotext = [state: State, setters: Setters];

const initialState: State = {
  todos: [],
  selectedTodo: null,
  tempTodo: null,
  filter: Filter.all,
  updatedAt: new Date(),
  loading: false,
  errorMessage: '',
};

const initialSetters: Setters = {
  setTodos: () => {},
  setErrorMessage: () => {},
  setFilter: () => {},
  setTempTodo: () => {},
  setUpdatedAt: () => {},
  setLoading: () => {},
  setSelectedTodo: () => {},
};

const initialCotext: InitialCotext = [initialState, initialSetters];

export const todosContext = React.createContext<InitialCotext>(initialCotext);

type Props = {
  children: React.ReactNode;
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<TodoWithLoader[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const state: State = {
    todos,
    selectedTodo,
    tempTodo,
    filter,
    updatedAt,
    loading,
    errorMessage,
  };
  const setters: Setters = {
    setTodos,
    setErrorMessage,
    setFilter,
    setTempTodo,
    setUpdatedAt,
    setLoading,
    setSelectedTodo,
  };

  const value: InitialCotext = [state, setters];

  return (
    <todosContext.Provider value={value}>{children}</todosContext.Provider>
  );
};
