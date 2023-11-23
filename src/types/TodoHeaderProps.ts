import { RefObject } from 'react';
import { Todo } from './Todo';

export interface TodoHeaderProps {
  isSubmitting: boolean;
  todoInput: string;
  setTodoInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: (event: React.FormEvent) => void;
  focusRef: RefObject<HTMLInputElement>;
  toggleAllTodos: () => void;
  isUpdatingAll: boolean;
  todos: Todo[];
}
