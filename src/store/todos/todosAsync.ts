import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import config from 'config';

const url = `${config.apiUrl}/todos`;

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (userId:number, thunkApi) => {
  try {
    const { data: todos } = await axios.get(`${url}?userId=${userId}`);

    return todos;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e.response.data);
  }
});

export const createTodo = createAsyncThunk('todos/createTodo', async (data:any, thunkApi) => {
  try {
    const { data: todo } = await axios.post(url, data);

    return todo;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e.response.data);
  }
});

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async (todoId:number, thunkApi) => {
  try {
    await axios.delete(`${url}/${todoId}`);

    return todoId;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e.response.data);
  }
});

export const updateTodo = createAsyncThunk('todos/updateTodo', async (data:any, thunkApi) => {
  try {
    const { todoId, todo } = data;
    const response = await axios.patch(`${url}/${todoId}`, todo);

    return response.data;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e.response.data);
  }
});
