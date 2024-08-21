/* eslint-disable @typescript-eslint/indent */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { todosSlice } from './features/todosSlice';
import { tempTodoSlice } from './features/tempTodoSlice';
import { focusedSlice } from './features/focusedSlice';

export const store = configureStore({
  reducer: {
    todos: todosSlice.reducer,
    tempTodo: tempTodoSlice.reducer,
    forms: focusedSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
