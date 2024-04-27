import React from 'react';
import { Todo } from '../types/Todo';

interface TodoListContextType {
  updateTodo: (todo: Todo) => void;
  updateTodoTitle: (todo: Todo, titleEntered: string) => void;
  deleteTodo: (todoId: number) => void;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  showEditedForm: boolean;
}

export const TodoListContext = React.createContext<TodoListContextType>({
  updateTodo: () => {},
  updateTodoTitle: () => {},
  deleteTodo: () => {},
  loadingTodoIds: [],
  tempTodo: null,
  showEditedForm: false,
});
