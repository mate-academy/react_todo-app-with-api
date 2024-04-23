import { Filter } from './Filter';
import { Todo } from './Todo';

export type Setters = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setSelectedTodo: (tempTodo: null | Todo) => void;
  setTempTodo: (tempTodo: null | Todo) => void;
  setFilter: (filter: Filter) => void;
  setErrorMessage: (errorMessage: string) => void;
  setUpdatedAt: (date: Date) => void;
  setLoading: (loading: boolean) => void;
};
