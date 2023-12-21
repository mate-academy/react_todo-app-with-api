import React from 'react';
import { Todo } from '../types/Todo';

type ITodoContext = {
  onDelete: (todoId: number) => void,
  updateTodo: (updatedTodo: Todo) => void,
  removeLoadingTodo: (todoId: number) => void,
  addLoadingTodo: (todoId: number) => void,
  loadingTodos: number[],
  deletingTodoId: number | null,
  isLoading: boolean,
  updateTodoOnServer: (todoId: number, data: Partial<Todo>) => Promise<void>,
};

export const TodoContext = React.createContext<ITodoContext>({
  onDelete: () => {},
  updateTodo: () => {},
  removeLoadingTodo: () => {},
  addLoadingTodo: () => {},
  loadingTodos: [],
  deletingTodoId: null,
  isLoading: false,
  updateTodoOnServer: async () => {},
});
