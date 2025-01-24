/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../types/Todo';
import {
  addTodosToAPI,
  deleteTodosFromAPI,
  getTodosFromAPI,
  updateTodoCheckAPI,
  updateTodosAPI,
} from '../api/todos';
import { ErrorType } from '../types/Errors';
import { Status } from '../types/Status';

type TodosState = {
  items: Todo[];
  loading: boolean;
  error: '' | ErrorType;
  tempTodo: Todo | null;
  isSubmitting: boolean;
  newTodoTitle: string;
  editingId: number | undefined;
  updatingId: number | undefined;
  loadingTodos: number[];
  status: Status;
};

const initialState: TodosState = {
  items: [],
  loading: true,
  error: '',
  tempTodo: null,
  isSubmitting: false,
  newTodoTitle: '',
  editingId: undefined,
  updatingId: undefined,
  loadingTodos: [],
  status: Status.all,
};

export const loadTodosFromServer = createAsyncThunk('todos/fetch', async () => {
  return getTodosFromAPI();
});

export const addNewTodo = createAsyncThunk(
  'todos/addTodo',
  (data: Omit<Todo, 'id'>) => {
    return addTodosToAPI(data);
  },
);

export const removeTodo = createAsyncThunk('todos/removeTodo', (todo: Todo) => {
  return deleteTodosFromAPI(todo);
});

export const updateTodoCheckStatus = createAsyncThunk(
  'todos/updateTodoCheckAPI',
  (todo: Todo) => {
    return updateTodoCheckAPI(todo);
  },
);

export const editTodoBody = createAsyncThunk(
  'todos/updateTodo',
  (todo: Todo) => {
    return updateTodosAPI(todo);
  },
);

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
    },
    setStatus: (state, action: PayloadAction<Status>) => {
      state.status = action.payload;
    },
    setTempTodo: (state, action: PayloadAction<Todo>) => {
      state.tempTodo = action.payload;
    },
    handleErrorNotification: (state, action: PayloadAction<ErrorType | ''>) => {
      state.error = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setUpdatingId: (state, action: PayloadAction<number | undefined>) => {
      state.updatingId = action.payload;
    },
    setEditingId: (state, action: PayloadAction<number | undefined>) => {
      state.editingId = action.payload;
    },
    setNewTodoTitle: (state, action: PayloadAction<string>) => {
      state.newTodoTitle = action.payload;
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      state.items = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, title: action.payload.title }
          : item,
      );
    },
    setLoadingTodos: (state, action: PayloadAction<number>) => {
      state.loadingTodos.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadTodosFromServer.pending, state => {
        state.loading = true;
      })
      .addCase(loadTodosFromServer.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(loadTodosFromServer.rejected, state => {
        state.loading = false;
        state.error = ErrorType.LOAD_TODOS;
      });

    builder
      .addCase(removeTodo.pending, state => {
        state.loading = true;
        state.error = '';
        state.isSubmitting = true;
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        state.items = state.items.filter(
          item => item.id !== action.meta.arg.id,
        );
      })
      .addCase(removeTodo.rejected, state => {
        state.error = ErrorType.DELETE_TODO;
      });

    builder
      .addCase(updateTodoCheckStatus.pending, (state, action) => {
        state.loading = true;
        state.loadingTodos.push(action.meta.arg.id);
      })
      .addCase(updateTodoCheckStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          item => item.id === action.meta.arg.id,
        );

        const updatedTodos = state.items;

        updatedTodos[index] = action.meta.arg;
        state.items = updatedTodos;
      })
      .addCase(updateTodoCheckStatus.rejected, state => {
        state.error = ErrorType.UPDATE_TODO;
      });

    builder
      .addCase(editTodoBody.pending, (state, action) => {
        state.loading = true;
        state.error = '';
        state.updatingId = action.meta.arg.id;
      })
      .addCase(editTodoBody.fulfilled, (state, action) => {
        const todo = action.meta.arg;

        state.items = state.items.map(item =>
          item.id === todo.id ? { ...item, title: todo.title } : item,
        );
        state.editingId = undefined;
      })
      .addCase(editTodoBody.rejected, (state, action) => {
        state.error = ErrorType.UPDATE_TODO;
        state.editingId = action.meta.arg.id;
      });

    builder
      .addCase(addNewTodo.pending, state => {
        state.loading = true;
        state.error = '';
        state.isSubmitting = true;
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.newTodoTitle = '';
      })
      .addCase(addNewTodo.rejected, state => {
        state.error = ErrorType.ADD_TODO;
      });

    builder.addMatcher(addNewTodo.settled, state => {
      state.isSubmitting = false;
      state.tempTodo = null;
      state.loading = false;
    });

    builder.addMatcher(editTodoBody.settled, state => {
      state.updatingId = undefined;
      state.loading = false;
    });

    builder.addMatcher(updateTodoCheckStatus.settled, (state, action) => {
      state.loadingTodos = state.loadingTodos.filter(
        id => id != action.meta.arg.id,
      );
      state.loading = false;
    });

    builder.addMatcher(removeTodo.settled, (state, action) => {
      state.isSubmitting = false;
      state.loadingTodos = state.loadingTodos.filter(
        id => id != action.meta.arg.id,
      );
      state.loading = false;
    });
  },
});

export const {
  setTodos,
  setTempTodo,
  handleErrorNotification,
  setNewTodoTitle,
  setLoadingTodos,
  setStatus,
  setEditingId,
} = todosSlice.actions;
export default todosSlice.reducer;
