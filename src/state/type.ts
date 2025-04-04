import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

export type TodoState = {
  todos: Todo[];
  filterTodosStatus: FilterStatus;
  error: string;
  tempTodo: Todo | null;
  processingTodoIds: number[];
  title: string;
  isLoading: boolean;
};

export type TodosAction =
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'SET_FILTER_STATUS'; payload: FilterStatus }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'REMOVE_TODO'; payload: number }
  | { type: 'UPDATE_TODO'; payload: { id: number; response: Todo } }
  | { type: 'PROCESSING_TODO_ADD'; payload: number }
  | { type: 'PROCESSING_TODO_REMOVE'; payload: number }
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'TEMP_TODO'; payload: Todo | null };
