import { combineReducers, configureStore } from '@reduxjs/toolkit';
// Middlewares
import errorMiddleware from 'middlewares/errorMiddelware';
// Reducers
import appReducer from 'store/app/appSlice';
import authReducer from 'store/auth/authSlice';
import usersReducer from 'store/users/usersSlice';
import todosReducer from 'store/todos/todosSlice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  users: usersReducer,
  todos: todosReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
    }).concat(errorMiddleware)
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
