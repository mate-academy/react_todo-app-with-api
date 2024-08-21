import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum ActiveInput {
  isHeader = 'header',
  isForm = 'form',
}

const initialState: ActiveInput =
  ActiveInput.isHeader satisfies ActiveInput as ActiveInput;

export const focusedSlice = createSlice({
  name: 'input',
  initialState,
  reducers: {
    setActiveInput: (_state, action: PayloadAction<ActiveInput>) =>
      action.payload,
  },
});

export const { setActiveInput } = focusedSlice.actions;
