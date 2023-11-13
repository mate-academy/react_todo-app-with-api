import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type StatusState = {
  statusFilter: string
  statusIdResponse: number | null
  statusAllCompleted: boolean
  statusAllChange: boolean
  allDeleteCompleted: boolean
};

const initialState: StatusState = {
  statusFilter: 'all',
  statusIdResponse: null,
  statusAllCompleted: false,
  statusAllChange: false,
  allDeleteCompleted: false,
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line no-param-reassign
      state.statusFilter = action.payload;
    },
    setStatusResponse: (state, action: PayloadAction<number | null>) => {
      // eslint-disable-next-line no-param-reassign
      state.statusIdResponse = action.payload;
    },
    setStatusAllCompleted: (state, action: PayloadAction<boolean>) => {
      // eslint-disable-next-line no-param-reassign
      state.statusAllCompleted = action.payload;
    },
    setStatusAllChange: (state, action: PayloadAction<boolean>) => {
      // eslint-disable-next-line no-param-reassign
      state.statusAllChange = action.payload;
    },
    setAllDeleteCompleted: (state, action: PayloadAction<boolean>) => {
      // eslint-disable-next-line no-param-reassign
      state.allDeleteCompleted = action.payload;
    },
  },
});

export const {
  setAllDeleteCompleted,
  setStatusAllChange,
  setStatusAllCompleted,
  setStatusFilter,
  setStatusResponse,
} = statusSlice.actions;

export default statusSlice.reducer;
