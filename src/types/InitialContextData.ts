import { Filter } from './Filter';
import { State } from './State';
import { Todo } from './Todo';

export interface InitialContextData {
  state: State;
  setLoadingItems: (payload: number[]) => void;
  setTodos: (payload: Todo[]) => void;
  addTodo: (payload: string) => Promise<void>;
  updateTodo: (payload: Todo) => Promise<void>;
  deleteTodo: (payload: number) => Promise<void>;
  setTempTodo: (payload: Todo) => void;
  setFilter: (payload: Filter) => void;
  setError: (payload: string) => void;
}
