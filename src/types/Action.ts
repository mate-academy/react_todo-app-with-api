import { Filter } from './Filter';
import { Todo } from './Todo';

export type Action =
  | { type: 'add'; todo: Todo }
  | { type: 'delete'; id: number }
  | { type: 'edit'; id: number; value: string }
  | { type: 'toggleAll'; value: boolean }
  | { type: 'complete'; id: number; value: boolean }
  | { type: 'filter'; payload: Filter }
  | { type: 'clearCompleted' }
  | { type: 'setTempTodo'; todo: Todo | null }
  | { type: 'setError'; message: string }
  | { type: 'setLoad'; value: boolean }
  | { type: 'onCompleteDelete' }
  | { type: 'setTodos'; todos: Todo[] }
  | { type: 'setLoadingTodo'; id: number; value: boolean }
  | { type: 'setShouldFocus' };
