import { Todo } from './Todo';

export type Action =
  | { type: 'SHOW_ALL' }
  | { type: 'SHOW_ERROR_MESSAGE'; payload: { message: string } }
  | { type: 'LOAD_TODOS'; payload: Todo[] }
  | { type: 'ADD_NEW_TODO'; payload: { title: string; id: number } }
  | { type: 'DELETE_TODO'; payload: { id: number } }
  | { type: 'SHOW_ACTIVE' }
  | { type: 'RESET_STATUS' }
  | { type: 'TOGGLE_TODO'; payload: { id: number } }
  | { type: 'REMOVE_LOCAL_TODO'; payload: { id: number } }
  | { type: 'MAKE_COMPLETED_TODOS' }
  | { type: 'MAKE_UNCOMPLETED_TODOS' }
  | { type: 'SHOW_COMPLETED' };
