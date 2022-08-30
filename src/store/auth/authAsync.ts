import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import StorageService from 'services/StorageService';
import { fetchUser } from 'store/users/usersAsync';
import { usersActions } from 'store/users/usersSlice';
import config from '../../config';
import { authActions } from './authSlice';

const url = `${config.apiUrl}/users`;

export const signIn = createAsyncThunk('auth/signIn', async (email:string, thunkApi) => {
  try {
    const { data } = await axios.get(`${url}?email=${email}`);

    if (data && !!data.length) {
      StorageService.setCurrentUserId(data[0].id);
      thunkApi.dispatch(fetchUser(data[0].id));
    } else {
      return thunkApi.rejectWithValue(null);
    }

    return data;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e.response.data);
  }
});

export const signUp = createAsyncThunk('auth/signUp', async (data:{ email: string, name: string }, thunkApi) => {
  try {
    const response = await axios.post(url, data);

    thunkApi.dispatch(usersActions.setCurrentUser(response.data));
    thunkApi.dispatch(authActions.setAuthorization(true));
    StorageService.setCurrentUserId(response.data.id);

    return response.data;
  } catch (e: any) {
    return thunkApi.rejectWithValue(e.response.data);
  }
});

// Check authenticated
export const checkIsAuthorization = createAsyncThunk('auth/checkIsAuthorization', async (_:any, thunkApi) => {
  const currentUserId = StorageService.getCurrentUserId();

  if (currentUserId) {
    thunkApi.dispatch(fetchUser(+currentUserId));
  } else {
    StorageService.removeCurrentUserId();
    thunkApi.dispatch(authActions.setAuthorization(false));
  }
});
