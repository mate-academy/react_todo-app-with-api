import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// Models
import ITodo from 'models/Todo';
// Async
import { createTodo, deleteTodo, fetchTodos, updateTodo } from './todosAsync';

interface IUsersState {
  todos: ITodo[] | null;
  filter: string | null;
}

const initialState: IUsersState = {
  todos: null,
  filter: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action:PayloadAction<string | null>) => {
      state.filter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.todos = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      // create todo
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos = state.todos ? [action.payload, ...state.todos] : [action.payload];
      })
      // delete todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos ? state.todos.filter((todo: ITodo) => todo.id !== action.payload) : null;
      })
      // update todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.todos = state.todos ? state.todos.map((todo: ITodo) => todo.id === action.payload.id ? action.payload : todo) : null;
      })
  },
});

export const todosActions = todosSlice.actions;
export default todosSlice.reducer;
