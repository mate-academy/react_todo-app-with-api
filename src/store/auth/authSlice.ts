import { createSlice } from '@reduxjs/toolkit';

interface IState {
  isAuthorization: boolean | null;
}

const initialState: IState = {
  isAuthorization: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthorization: (state, action) => {
      state.isAuthorization = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
