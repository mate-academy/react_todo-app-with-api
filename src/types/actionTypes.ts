import { Todo, TodosListType } from './todosTypes';

export type Actions = {
  type: 'LOAD',
  payload: TodosListType,
} | {
  type: 'POST',
  payload: Todo,
} | {
  type: 'DELETE',
  payload: number,
} | {
  type: 'PATCH',
  payload: Todo,
} | {
  type: 'ALL_ACTIVE',
  payload: null,
} | {
  type: 'IS_SPINNING',
  payload: number,
} | {
  type: 'REMOVE_SPINNING',
  payload: number,
};
