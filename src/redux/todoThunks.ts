import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  addTodoApi,
  deleteCompletedTodosApi,
  fetchTodosApi,
  deleteTodoApi,
  renameTodoApi,
  setTodoCompletionApi,
  completeAllTodosApi,
} from '../api/todos';

import {
  fetchTodosPending,
  fetchTodosFulfilled,
  fetchTodosRejected,
  addTodoFulfilled,
  addTodoPending,
  addTodoRejected,
  deleteTodoPending,
  deleteTodoFulfilled,
  deleteTodoRejected,
  renameTodoPending,
  renameTodoFulfilled,
  renameTodoRejected,
  setCompletionPending,
  setCompletionFulfilled,
  setCompletionRejected,
  deleteAllCompletedTodosPending,
  deleteAllCompletedTodosFulfilled,
  deleteAllCompletedTodosRejected,
  completeAllTodosPending,
  completeAllTodosFulfilled,
  completeAllTodosRejected,
} from './todoSlice';
import { RootState } from './store';
import { Todo } from '../types';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId: number, { dispatch }) => {
    dispatch(fetchTodosPending());

    try {
      const todos = await fetchTodosApi(userId);

      dispatch(fetchTodosFulfilled(todos));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to fetch todo';

      dispatch(fetchTodosRejected(errorMessage));
    }
  },
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async ({ title }: { title: string }, { dispatch }) => {
    dispatch(addTodoPending({ title }));

    try {
      const response = await addTodoApi(title);
      const newTodo = response.data;

      dispatch(addTodoFulfilled(newTodo));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(addTodoRejected(error.message));
      } else {
        dispatch(addTodoRejected('Failed to add todo'));
      }
    }
  },
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId: number, { dispatch }) => {
    dispatch(deleteTodoPending(todoId));

    try {
      await deleteTodoApi(todoId);
      dispatch(deleteTodoFulfilled(todoId));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'failed to delete todo';

      dispatch(deleteTodoRejected({ todoId, errorMessage }));
    }
  },
);

export const deleteAllCompletedTodos = createAsyncThunk(
  'todos/deleteAllCompletedTodos',
  async (userId: number, { dispatch }) => {
    dispatch(deleteAllCompletedTodosPending());

    try {
      await deleteCompletedTodosApi(userId);
      dispatch(deleteAllCompletedTodosFulfilled());
    } catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : 'Failed to delete completed todos';

      dispatch(deleteAllCompletedTodosRejected(errorMessage));
    }
  },
);

export const renameTodo = createAsyncThunk(
  'todos/renameTodo',
  async (
    { todoId, newName }: { todoId: number; newName: string },
    { dispatch },
  ) => {
    dispatch(renameTodoPending(todoId));

    try {
      const updatedTodo = await renameTodoApi(todoId, newName);

      dispatch(renameTodoFulfilled(updatedTodo));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to rename todo';

      dispatch(renameTodoRejected(errorMessage));
    }
  },
);

export const setCompletion = createAsyncThunk(
  'todos/setCompletion',
  async (
    { todoId, completed }: { todoId: number; completed: boolean },
    { dispatch },
  ) => {
    dispatch(setCompletionPending(todoId));

    try {
      await setTodoCompletionApi(todoId, completed);
      dispatch(setCompletionFulfilled({ id: todoId, completed }));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to set completion';

      dispatch(setCompletionRejected({ todoId, errorMessage }));
    }
  },
);

function getCurrentState(getState: () => RootState): RootState {
  return getState() as RootState;
}

export const completeAllTodos = createAsyncThunk(
  'todos/completeAllTodos',
  async (_, { dispatch, getState }) => {
    dispatch(completeAllTodosPending());

    try {
      const state: RootState = getState();
      const activeTodos
        = Array.prototype.filter.call(
          state.todos, (todo: Todo) => !todo.completed,
        );

      await completeAllTodosApi(activeTodos);

      dispatch(completeAllTodosFulfilled());
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to complete all todos';

      dispatch(completeAllTodosRejected(errorMessage));
    }
  },
);
