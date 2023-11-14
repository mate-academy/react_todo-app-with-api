/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
// import { Todo } from '../types/Todo';
import {
  addTodoApi,
  deleteCompletedTodosForUser,
  fetchTodosApi,
  deleteTodoApi,
  renameTodoApi,
  setTodoCompletionApi,
  // completeAllTodosApi,
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
} from './todoSlice';

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
  'todos/deleteAllCompleted',
  async (userId: number, { rejectWithValue }) => {
    try {
      await deleteCompletedTodosForUser(userId);
    } catch (error) {
      rejectWithValue('Failed to delete completed todos');
    }
  },
);

export const setCompletion = createAsyncThunk(
  'todos/setCompletion',
  async (
    { todoId, completed }: { todoId: number; completed: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await setTodoCompletionApi(todoId, completed);

      return response;
    } catch (error) {
      return rejectWithValue('Failed to update todo completion status');
    }
  },
);

// export const completeAllTodos = createAsyncThunk(
//   'todos/completeAll',
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const state: RootState = getState();
//       const activeTodos = state.todos.filter((todo: Todo) => !todo.completed);

//       const updatedTodos = await completeAllTodosApi(activeTodos);

//       return updatedTodos;
//     } catch (error) {
//       return rejectWithValue('Failed to complete all todos');
//     }
//   },
// );

export const renameTodo = createAsyncThunk(
  'todos/renameTodo',
  async (
    { todoId, newName }: { todoId: number; newName: string },
    { rejectWithValue },
  ) => {
    try {
      const updatedTodo = await renameTodoApi(todoId, newName);

      return updatedTodo;
    } catch (error) {
      return rejectWithValue('Failed to rename todo');
    }
  },
);
