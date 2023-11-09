import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/Todo';

export const USER_ID = 11822;

export enum ActionState {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const initialValue: Context = {
  todos: [],
  filterTodos: ActionState.ALL,
  setFilterTodos: () => { },
  visibleTodos: [],
  errorMessage: '',
  setErrorMessage: () => { },
  dispatch: () => { },
  deletedId: [],
  setDeletedId: () => { },
  isLoading: false,
  setIsLoading: () => { },
  isSubmitting: false,
  setIsSubmitting: () => { },
  title: '',
  setTitle: () => { },
};

export interface Context {
  todos: Todo[],
  filterTodos: ActionState,
  setFilterTodos: (val: ActionState) => void,
  visibleTodos: Todo[],
  errorMessage: string,
  setErrorMessage: (val: string) => void,
  dispatch: any,
  deletedId: number[],
  setDeletedId: Dispatch<SetStateAction<number[]>>,
  isLoading: boolean,
  setIsLoading: (val: boolean) => void,
  isSubmitting: boolean,
  setIsSubmitting: (val: boolean) => void,
  title: string,
  setTitle: (val: string) => void,
}

export enum ErrorType {
  Loading = 'Title should not be empty',
  CreateTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  UpdateTodo = 'Unable to update a todo',
}
