import { Errors } from './Errors';
import { Filter } from './Filter';
import { Todo } from './Todo';

export interface TodoContextType {
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  error: Errors | null,
  setError: React.Dispatch<React.SetStateAction<Errors | null>>,
  removeTodo: (id: number) => void,
  filterType: Filter,
  setFilterType: (value: Filter) => void,
  filteredTodo: Todo[],
  USER_ID: number,
}
