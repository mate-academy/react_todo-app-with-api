import { TodosListType, Todo } from '../../types/todosTypes';
import { Actions } from '../../types/actionTypes';

export const loadTodosAction = (data: TodosListType): Actions => ({
  type: 'LOAD',
  payload: data,
});

export const postTodoAction = (data: Todo): Actions => ({
  type: 'POST',
  payload: data,
});

export const deleteTodoAction = (data: number): Actions => ({
  type: 'DELETE',
  payload: data,
});

export const patchTodoAction = (data: Todo) : Actions => ({
  type: 'PATCH',
  payload: data,
});

export const setIsSpinningAction = (data: number): Actions => ({
  type: 'IS_SPINNING',
  payload: data,
});

export const removeIsSpinningAction = (data: number): Actions => ({
  type: 'REMOVE_SPINNING',
  payload: data,
});
