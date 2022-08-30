import { createSlice } from '@reduxjs/toolkit';
// Services
import StorageService from 'services/StorageService';
// Models
import IUser from 'models/User';
// Async
import { fetchUser } from './usersAsync';

interface IUsersState {
  currentUser: IUser | null;
}

const initialState: IUsersState = {
  currentUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    removeCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch user
      .addCase(fetchUser.pending, (state) => {
        state.currentUser = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(fetchUser.rejected, () => {
        StorageService.removeCurrentUserId();
      });
  },
});

export const usersActions = usersSlice.actions;
export default usersSlice.reducer;
