import React from 'react';
import { Todo } from './types/Todo';
import { ErrorMessage } from './utils/enums';

type TodoContextType = {
  filteredTodo:Todo[];
  deleteTodo: (id:number) => void
  setTodos:(v: Todo[]) => void
  todos:Todo[]
  isSubmitting: boolean,
  setIsSubmiting:(v: boolean) => void,
  isDeliting: boolean,
  setIsDeliting:(v: boolean) => void,
  setSelectedTodo:(v: number) => void,
  selectedTodo: number,
  clear: boolean,
  errorHandler: (v: ErrorMessage) => void,
};

export const TodoContext = React.createContext<TodoContextType>({
  filteredTodo: [],
  deleteTodo: () => {},
  setTodos: () => {},
  todos: [],
  isSubmitting: false,
  setIsSubmiting: () => {},
  isDeliting: false,
  setIsDeliting: () => {},
  setSelectedTodo: () => {},
  selectedTodo: 0,
  clear: false,
  errorHandler: () => {},
});
