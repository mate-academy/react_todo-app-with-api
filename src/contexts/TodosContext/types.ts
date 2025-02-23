import { ClientTodo, Todo } from '../../types';

export type Action =
  | { type: 'set'; payload: Todo[] }
  | { type: 'delete'; payload: Todo['id'] }
  | { type: 'add'; payload: Todo }
  | { type: 'update'; payload: ClientTodo };
