import { Todo } from './Todo';

export interface HeaderProps {
  setError: (error: string | null) => void;
  newTodoTitle: string;
  setLoadingTodo: (value: boolean) => void;
  setTempTodo: (todo: Todo) => void;
  setNewTodoTitle: (value: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingTodo: boolean;
  handleAddTodo: (title: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement>;
  todos: Todo[];
  toggleAll: () => void;
  isTodosLoading: boolean;
}
