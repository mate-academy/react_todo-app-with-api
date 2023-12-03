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

import { Todo } from '../types';
import * as todoActions from './todoActions';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (userId: number, { dispatch }) => {
    dispatch(todoActions.fetchTodosPending());

    try {
      const todos = await fetchTodosApi(userId);

      dispatch(todoActions.fetchTodosFulfilled(todos));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to fetch todo';

      dispatch(todoActions.fetchTodosRejected(errorMessage));
    }
  },
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async ({ title }: { title: string }, { dispatch }) => {
    dispatch(todoActions.addTodoPending({ title }));

    try {
      const response = await addTodoApi(title);
      const newTodo = response.data;

      dispatch(todoActions.addTodoFulfilled(newTodo));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(todoActions.addTodoRejected(error.message));
      } else {
        dispatch(todoActions.addTodoRejected('Failed to add todo'));
      }
    }
  },
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId: number, { dispatch }) => {
    dispatch(todoActions.deleteTodoPending(todoId));

    try {
      await deleteTodoApi(todoId);
      dispatch(todoActions.deleteTodoFulfilled(todoId));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'failed to delete todo';

      dispatch(todoActions.deleteTodoRejected({ todoId, errorMessage }));
    }
  },
);

export const deleteAllCompletedTodos = createAsyncThunk(
  'todos/deleteAllCompletedTodos',
  async (userId: number, { dispatch }) => {
    dispatch(todoActions.deleteAllCompletedTodosPending());

    try {
      await deleteCompletedTodosApi(userId);
      dispatch(todoActions.deleteAllCompletedTodosFulfilled());
    } catch (error) {
      const errorMessage
        = error instanceof Error
          ? error.message
          : 'Failed to delete completed todos';

      dispatch(todoActions.deleteAllCompletedTodosRejected(errorMessage));
    }
  },
);

export const renameTodo = createAsyncThunk(
  'todos/renameTodo',
  async (
    { todoId, newTitle }: { todoId: number; newTitle: string },
    { dispatch },
  ) => {
    dispatch(todoActions.renameTodoPending(todoId));

    try {
      const updatedTodo = await renameTodoApi(todoId, newTitle);

      dispatch(todoActions.renameTodoFulfilled(updatedTodo));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to rename todo';

      dispatch(todoActions.renameTodoRejected(errorMessage));
    }
  },
);

export const setCompletion = createAsyncThunk(
  'todos/setCompletion',
  async (
    { todoId, completed }: { todoId: number; completed: boolean },
    { dispatch },
  ) => {
    dispatch(todoActions.setCompletionPending(todoId));

    try {
      await setTodoCompletionApi(todoId, completed);
      dispatch(todoActions.setCompletionFulfilled({ id: todoId, completed }));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to set completion';

      dispatch(todoActions.setCompletionRejected({ todoId, errorMessage }));
    }
  },
);

export const completeUncompletedTodos = createAsyncThunk(
  'todos/completeUncompletedTodos',
  async (uncompletedTodos: Todo[], { dispatch }) => {
    dispatch(todoActions.completeUncompletedTodosPending());

    try {
      const updatedTodos
        = uncompletedTodos.map(todo => ({ ...todo, completed: true }));

      await completeAllTodosApi(updatedTodos);
      dispatch(todoActions.completeUncompletedTodosFulfilled(updatedTodos));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to complete uncompleted todos';

      dispatch(todoActions.completeUncompletedTodosRejected(errorMessage));
    }
  },
);

export const toggleAllTodos = createAsyncThunk(
  'todos/toggleAllTodos',
  async (todos: Todo[], { dispatch }) => {
    dispatch(todoActions.toggleAllTodosPending());

    try {
      const togglePromises
        = todos.map(todo => setTodoCompletionApi(todo.id, !todo.completed));

      const updatedTodos = await Promise.all(togglePromises);

      dispatch(todoActions.toggleAllTodosFulfilled(updatedTodos));
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to toggle todos';

      dispatch(todoActions.toggleAllTodosRejected(errorMessage));
    }
  },
);
