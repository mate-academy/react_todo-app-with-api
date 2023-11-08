import { RefObject } from 'react';

export interface TodoHeaderProps {
  isSubmitting: boolean;
  todoInput: string;
  setTodoInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddTodo: (event: React.FormEvent) => void;
  focusRef: RefObject<HTMLInputElement>;
}
