import { Todo } from '../types/Todo';

export enum FilterFields {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export type TodoState = {
  tempTodo: null | Todo;
  todos: Todo[];
  filter: FilterFields;
  isLoading: boolean;
  error: string | null;
  refresh: number;
  loadingAll: boolean;
};

export enum ActionTypes {
  ADD_TODO = 'ADD_TODO',
  ADD_TEMP_TODO = 'ADD_TEMP_TODO',
  EDIT_TODO = 'EDIT_TODO',
  TOGGLE_TODO = 'TOGGLE_TODO',
  DELETE_TODO = 'DELETE_TODO',
  SET_FILTER = 'SET_FILTER ',
  SET_TODOS = 'SET_TODOS',
  SET_LOADING_ALL = 'SET_LOADING_ALL',
  SET_ERROR = 'SET_ERROR',
  SET_REFRESH = 'SET_REFRESH',
}

export type Action =
  | { type: ActionTypes.ADD_TODO; payload: Todo }
  | { type: ActionTypes.ADD_TEMP_TODO; payload: Todo | null }
  | { type: ActionTypes.EDIT_TODO; payload: { id: number; title: string } }
  | { type: ActionTypes.TOGGLE_TODO; payload: Todo }
  | { type: ActionTypes.DELETE_TODO; payload: number }
  | { type: ActionTypes.SET_LOADING_ALL; payload: boolean }
  | { type: ActionTypes.SET_FILTER; payload: FilterFields }
  | { type: ActionTypes.SET_TODOS; payload: Todo[] }
  | { type: ActionTypes.SET_ERROR; payload: string | null }
  | { type: ActionTypes.SET_REFRESH };
