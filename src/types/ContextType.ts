import { OptionsTodos } from '../constans';
import { Todo } from './Todo';

export interface TodosContextType {
  todos: Todo[];
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
  tempTodo: Todo | null;
  setTempTodo: (tempTodo: Todo | null) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  option: OptionsTodos;
  setOption: (option: OptionsTodos) => void;
  deletedTodosId: number[] | null;
  updatedTodos: Todo[] | null;
  loadTodos: () => void;
  addTodo: (todo: Todo) => Promise<void>;
  deletedTodos: (todosId: number[]) => void;
  updateTodos: (todosForUpdate: Todo[]) => void;
  newError: (error: string) => void;
  titleField: React.RefObject<HTMLInputElement>;
}
