import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { authActions } from 'store/auth/authSlice';
import config from 'config';

const url = `${config.apiUrl}/users`;

export const fetchUser = createAsyncThunk('users/fetchUser', async (userId:number, thunkApi) => {
  try {
    const { data } = await axios.get(`${url}/${userId}`);

    thunkApi.dispatch(authActions.setAuthorization(true));

    return data;
  } catch (e: any) {
    thunkApi.dispatch(authActions.setAuthorization(false));

    return thunkApi.rejectWithValue(e.response.data);
  }
});
