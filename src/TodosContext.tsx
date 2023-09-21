import React from 'react';
import { Error } from './types/Error';
import { Todo } from './types/Todo';

type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  error: Error;
  setError: (e: Error) => void;
  setTempTodo: (newTodo: Todo | null) => void;
  deleteTodo: (id: number) => Promise<unknown>;
  addTodo: (data: Omit<Todo, 'id'>) => Promise<void>;
  updateTodo: (id: number, data: Partial<Todo>) => Promise<Todo>;
  setUpdatingTodosId: (id: number[]) => void;
  updatingTodosId: number[];
};

const initialState: State = {
  tempTodo: null,
  todos: [],
  setTodos: () => {},
  setTempTodo: () => {},
  error: Error.None,
  setError: () => {},
  deleteTodo: () => new Promise<unknown>(() => {}),
  addTodo: () => new Promise<void>(() => {}),
  updateTodo: () => new Promise<Todo>(() => {}),
  setUpdatingTodosId: () => {},
  updatingTodosId: [],
};

export const TodosContext = React.createContext(initialState);
