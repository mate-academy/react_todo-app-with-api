import { createAsyncThunk } from '@reduxjs/toolkit';
import { clearErrorType, hideError, showError } from './todoSlice';

export const showErrorWithTimeout = createAsyncThunk(
  'todos/showErrorWithTimeout',
  async (_, { dispatch }) => {
    dispatch(showError());
    setTimeout(() => {
      dispatch(hideError());
      dispatch(clearErrorType());
    }, 3000);
  },
);
