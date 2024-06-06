/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

export type ContextProps = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  todosToDelete: number[];
  setTodosToDelete: React.Dispatch<React.SetStateAction<number[]>>;
};

export const Context = React.createContext<ContextProps>({
  todos: [],
  setTodos: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  filter: Filter.All,
  setFilter: () => {},
  todosToDelete: [],
  setTodosToDelete: () => {},
});
