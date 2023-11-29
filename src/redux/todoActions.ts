import { createAction } from '@reduxjs/toolkit';
import { Todo, TodoActionErrorPayload } from '../types';

export const fetchTodosPending
  = createAction(
    'todos/fetchTodosPending',
  );
export const fetchTodosFulfilled
  = createAction<Todo[]>(
    'todos/fetchTodosSuccess',
  );
export const fetchTodosRejected
  = createAction<string>(
    'todos/fetchTodosFailure',
  );

export const addTodoPending
  = createAction<{ title: string }>(
    'todos/addTodoPending',
  );
export const addTodoFulfilled
  = createAction<Todo>(
    'todos/addTodoFulfilled',
  );
export const addTodoRejected
  = createAction<string>(
    'todos/addTodoRejected',
  );

export const deleteTodoPending
  = createAction<number>(
    'todos/deleteTodoPending',
  );
export const deleteTodoFulfilled
  = createAction<number>(
    'todos/deleteTodoFulfilled',
  );
export const deleteTodoRejected
  = createAction<TodoActionErrorPayload>(
    'todos/deleteTodoRejected',
  );

export const renameTodoPending
  = createAction<number>(
    'todos/renameTodoPending',
  );
export const renameTodoFulfilled
  = createAction<Todo>(
    'todos/renameTodoFulfilled',
  );
export const renameTodoRejected
  = createAction<string>(
    'todos/renameTodoRejected',
  );

export const setCompletionPending
  = createAction<number>(
    'todos/setCompletionPending',
  );
export const setCompletionFulfilled
  = createAction<{ id: number; completed: boolean }>(
    'todos/setCompletionFulfilled',
  );
export const setCompletionRejected
  = createAction<TodoActionErrorPayload>(
    'todos/setCompletionRejected',
  );

export const deleteAllCompletedTodosPending
  = createAction(
    'todos/deleteAllCompletedTodosPending',
  );
export const deleteAllCompletedTodosFulfilled
  = createAction(
    'todos/deleteAllCompletedTodosFulfilled',
  );
export const deleteAllCompletedTodosRejected
  = createAction<string>(
    'todos/deleteAllCompletedTodosRejected',
  );

export const completeAllTodosPending
  = createAction(
    'todos/completeAllTodosPending',
  );
export const completeAllTodosFulfilled
  = createAction<boolean>(
    'todos/completeAllTodosFulfilled',
  );
export const completeAllTodosRejected
  = createAction<string>(
    'todos/completeAllTodosRejected',
  );
