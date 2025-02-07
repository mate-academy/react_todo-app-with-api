import { Todo } from './Todo';

type LoadingState = {
  isAdding: boolean;
  updatingTodos: Set<number>;
  deletingTodos: Set<number>;
  isLoading: boolean;
};

export type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingState: LoadingState;
};

type KeyType = 'updatingTodos' | 'deletingTodos';

export type Action =
  | { type: 'SET_TODOS'; payload: Todo[] }
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: number }
  | { type: 'SET_TEMP_TODO'; payload: Omit<Todo, 'id' | 'userId'> }
  | { type: 'CLEAR_TEMP_TODO' }
  | { type: 'TOGGLE_LOADING'; payload: { key: KeyType; todoId: number } };
