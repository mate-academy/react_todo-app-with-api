import { Filter } from './Filter';
import { Todo } from './Todo';

export type Action =
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'addTodo'; payload: Todo }
  | { type: 'updateTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'addTempTodo'; payload: Todo | null }
  | { type: 'setFilter'; payload: Filter }
  | { type: 'setError'; payload: string }
  | { type: 'setLoadingItems'; payload: number[] };
