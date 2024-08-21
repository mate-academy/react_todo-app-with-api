// eslint-disable-next-line import/no-extraneous-dependencies
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types/Todo';

export type StateTempTodoType = null | Todo;

const initialState = null satisfies StateTempTodoType as StateTempTodoType;

export const tempTodoSlice = createSlice({
  name: 'tempTodo',
  initialState,
  reducers: {
    setNewTempTodo: (_state, action: PayloadAction<StateTempTodoType>) =>
      action.payload,
  },
});

export const { setNewTempTodo } = tempTodoSlice.actions;
