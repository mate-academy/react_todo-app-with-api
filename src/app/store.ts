import { configureStore } from '@reduxjs/toolkit';
import todosSlice from '../features/todos';
import statusSlice from '../features/status';
// ...

const store = configureStore({
  reducer: {
    todos: todosSlice,
    status: statusSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
