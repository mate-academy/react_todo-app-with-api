import { Todo } from '../../types/Todo';

export interface TodoAppHeaderProps {
  todos: Todo[];
  todoTitle: string;
  setTitle: (title: string) => void;
  handleUpdateAllStatus: () => Promise<void>;
  isInputDisabled: boolean;
  setError: (newError: string) => void;
  addTodo: (title: string) => Promise<void>;
}
