import { FilterType } from './FilterType';
import { Todo } from './Todo';

export type Action =
  | { type: 'ADD_TODO'; newTodo: Todo }
  | { type: 'WRITE_NEW_TITLE'; newTitle: string }
  | { type: 'SET_TEMPORARY_TODO'; tempTodo: Omit<Todo, 'editted'> | null }
  | { type: 'CHANGE_STATUS'; id: number }
  | { type: 'DELETE_TODO'; id: number }
  | { type: 'FILTER_TODOS'; filteredOptions: FilterType }
  | { type: 'EDIT_TODO'; id: number }
  | { type: 'HANDLE_ESCAPE'; id: number }
  | { type: 'CHANGE_TITLE'; id: number; changedTitle: string }
  | { type: 'FOCUS_ON_INPUT'; value: boolean }
  | { type: 'GET_TODOS'; todos: Todo[] }
  | { type: 'LOADING_TODOS'; id: number[] }
  | { type: 'SHOW_ERROR'; message: string }
  | { type: 'INPUT_ON_BLUR' };
