import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';
import * as todoService from '../api/todos';

export const init = createAsyncThunk('todos/fetch', (userId: number) => {
  return todoService.getTodos(userId);
});

type TodoState = {
  todos: Todo[];
  isLoading: boolean;
  errorMessage: string;
  temporaryTodo: null | Todo;
};

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  errorMessage: '',
  temporaryTodo: null,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    take: (state, action: PayloadAction<number>) => {
      // eslint-disable-next-line no-param-reassign
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    update: (state, action: PayloadAction<Omit<Todo, 'userId'>>) => {
      // eslint-disable-next-line no-param-reassign
      state.todos = state.todos.map((todo) => {
        if (todo.id === action.payload.id) {
          return {
            ...todo,
            completed: action.payload.completed,
            title: action.payload.title,
          };
        }

        return todo;
      });
    },
    setErrorMessage: (state, action: PayloadAction<string>) => {
      // eslint-disable-next-line no-param-reassign
      state.errorMessage = action.payload;
    },

    clearErrorMessage: (state) => {
      // eslint-disable-next-line no-param-reassign
      state.errorMessage = '';
    },

    addTempo: (state, action: PayloadAction<Todo>) => {
      // eslint-disable-next-line no-param-reassign
      state.temporaryTodo = action.payload;
    },

    clearTempo: (state) => {
      // eslint-disable-next-line no-param-reassign
      state.temporaryTodo = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(init.pending, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = true;
    });

    builder.addCase(init.rejected, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.errorMessage = 'Unable to load todos';
    });

    builder.addCase(init.fulfilled, (state, action) => {
      // eslint-disable-next-line no-param-reassign
      state.isLoading = false;
      // eslint-disable-next-line no-param-reassign
      state.todos = action.payload;
    });
  },
});

export const {
  add, take, update, addTempo, clearTempo, setErrorMessage, clearErrorMessage,
} = todosSlice.actions;

export default todosSlice.reducer;
