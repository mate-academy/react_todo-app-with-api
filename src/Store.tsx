import React, { useState } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { State } from './types/State';
import { Setters } from './types/Setters';
import { deleteTodo, editTodo } from './api/todos';
import { errorText } from './constants';
import { item } from './utils/utils';
import { Handlers } from './types/Handlers';
type InitialCotext = {
  state: State;
  setters: Setters;
  handlers: Handlers;
};

const initialState: State = {
  todos: [],
  loadingTodos: [],
  selectedTodo: null,
  tempTodo: null,
  filter: Filter.all,
  updatedAt: new Date(),
  loading: false,
  errorMessage: '',
};

const initialHandlers: Handlers = {
  handleUpdate: () => {},
  handleDelete: () => {},
};

const initialSetters: Setters = {
  setTodos: () => {},
  setLoadingTodos: () => {},
  setErrorMessage: () => {},
  setFilter: () => {},
  setTempTodo: () => {},
  setUpdatedAt: () => {},
  setLoading: () => {},
  setSelectedTodo: () => {},
};

const initialCotext: InitialCotext = {
  state: initialState,
  setters: initialSetters,
  handlers: initialHandlers,
};

export const todosContext = React.createContext<InitialCotext>(initialCotext);

type Props = {
  children: React.ReactNode;
};

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState(Filter.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState<Todo[]>([]);

  function handleUpdate(todo: Todo, completedStatus: boolean, title: string) {
    const updatedTitle = title.length === 0 ? todo.title : title;
    const newTodo: Todo = item.createNew(updatedTitle, completedStatus);

    setLoading(true);
    setErrorMessage('');
    setLoadingTodos(loadingTodos1 => [...loadingTodos1, todo]);

    editTodo(todo.id, newTodo)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(currentTodo =>
            currentTodo.id === todo.id ? { ...updatedTodo } : currentTodo,
          ),
        );
      })
      .catch(error => {
        setErrorMessage(errorText.failUpdating);
        throw error;
      })
      .finally(() => {
        setLoadingTodos(loadingTodos1 =>
          loadingTodos1.filter(oldTodo => oldTodo.id !== todo.id),
        );
      })
      .then(() => {
        setSelectedTodo(null);
      });
  }

  function handleDelete(todo: Todo) {
    setLoading(true);
    setErrorMessage('');
    setLoadingTodos(loadingTodos1 => [...loadingTodos1, todo]);
    deleteTodo(todo.id)
      .then(() => {
        setTodos(oldTodos =>
          oldTodos.filter(oldTodo => oldTodo.id !== todo.id),
        );
      })
      .catch(error => {
        setLoadingTodos(loadingTodos1 =>
          loadingTodos1.filter(oldTodo => oldTodo.id !== todo.id),
        );
        setErrorMessage(errorText.failDeleting);
        throw error;
      })
      .finally(() => {
        setLoading(false);
      })
      .then(() => setSelectedTodo(null));
  }

  const state: State = {
    todos,
    selectedTodo,
    tempTodo,
    filter,
    updatedAt,
    loading,
    errorMessage,
    loadingTodos,
  };
  const setters: Setters = {
    setTodos,
    setErrorMessage,
    setFilter,
    setTempTodo,
    setUpdatedAt,
    setLoading,
    setSelectedTodo,
    setLoadingTodos,
  };

  const handlers: Handlers = {
    handleUpdate,
    handleDelete,
  };

  const value: InitialCotext = { state, setters, handlers };

  return (
    <todosContext.Provider value={value}>{children}</todosContext.Provider>
  );
};
