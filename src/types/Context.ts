import React from 'react';
import { Status } from './Status';
import { Todo } from './Todo';

export interface Context {
  todos: Todo[],
  setTodos: (todos: Todo[] | ((prev: Todo[]) => Todo[])) => void,
  errorMessage: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  filterTodos: Status,
  setFilterTodos: (filterField: Status) => void,
  tempTodo: Todo | null,
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  loadingIds: number[];
  setLoadingIds: (value: React.SetStateAction<number[]>) => void;
}

export interface ContextUpdate {
  addTodo: (newTodo: Omit<Todo, 'id'>) => void,
  deleteTodo: (todoId: number) => void,
  toggleTodo: (updatedTodo: Omit<Todo, 'UserId'>) => void,
  editTodo: (titleId: number, editTitle: string) => void,
}
