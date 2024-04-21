import { Filter } from './Filter';
import { Todo } from './Todo';
import { TodoWithLoader } from './TodoWithLoader';

export type Setters = {
  setTodos: React.Dispatch<React.SetStateAction<TodoWithLoader[]>>;
  setSelectedTodo: (tempTodo: null | Todo) => void;
  setTempTodo: (tempTodo: null | Todo) => void;
  setFilter: (filter: Filter) => void;
  setErrorMessage: (errorMessage: string) => void;
  setUpdatedAt: (date: Date) => void;
  setLoading: (loading: boolean) => void;
};
