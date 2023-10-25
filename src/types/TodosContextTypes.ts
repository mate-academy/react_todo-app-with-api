import { Filter } from './Filter';
import { Todo } from './Todo';

export type TodosContextType = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filtredTodos: Todo[];
  isLoadingTodo: number[];
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  statusFilter: Filter;
  setStatusFilter: (status: Filter) => void;
  title: string;
  setTitle: (title: string) => void;
  statusResponse: boolean;
  setStatusResponse: (status: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  changeErrorMessage: (message: string) => void;
  addTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  deleteTodo: (todoId: number) => void;
  updateTodo: (todo: Todo) => Promise<void | Todo>;
  activeTodos: number;
  hasSomeCompletedTodos: boolean;
  handleClearCompleted : () => void;
  toggleTodo: (todo: Todo) => void;
  handleToggleAll: () => void;
};