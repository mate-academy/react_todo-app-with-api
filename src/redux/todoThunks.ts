/* eslint-disable no-console */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';
import {
  AddTodoResponse,
  addTodoApi,
  deleteCompletedTodosForUser,
  getTodos,
  removeTodoApi,
  renameTodoApi,
  setTodoCompletionApi,
} from '../api/todos';

export const fetchTodos
  = createAsyncThunk<Todo[], number, { rejectValue: string }>(
    'todos/fetchTodos',
    async (userId, { rejectWithValue }) => {
      try {
        const todos = await getTodos(userId);

        return todos;
      } catch (error) {
        return rejectWithValue('Failed to fetch todos');
      }
    },
  );

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async ({ title }: { title: string }): Promise<Todo> => {
    const response: AddTodoResponse = await addTodoApi(title);

    console.log(response.data, 'in thunk');

    return response.data;
  },
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId: number) => {
    await removeTodoApi(todoId);

    return todoId;
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
