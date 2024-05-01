import React from 'react';
import { Todo } from '../types/Todo';

interface TodoListContextType {
  updateTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, titleEntered: string) => Promise<void>;
  deleteTodo: (todoId: number) => Promise<void>;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
}

export const TodoListContext = React.createContext<TodoListContextType>({
  updateTodo: () => {},
  updateTodoTitle: async () => {},
  deleteTodo: async () => {},
  loadingTodoIds: [],
  tempTodo: null,
});
