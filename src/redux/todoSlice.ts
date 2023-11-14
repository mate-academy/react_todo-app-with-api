/* eslint-disable no-param-reassign */
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  Todo,
  TodoFilter,
  ErrorType,
  TodoActionErrorPayload,
} from '../types';

import { USER_ID } from '../_utils/constants';

export interface TodoState {
  todos: Todo[];
  tempTodo: Todo | null;
  inputValue: string,
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  currentFilter: TodoFilter;
  errorType: ErrorType | null;
  deletingTodoIds: number[];
  updatingTodoIds: number[];
  renamingTodoId: number | null;
}

const initialState: TodoState = {
  todos: [],
  tempTodo: null,
  inputValue: '',
  status: 'idle',
  error: null,
  currentFilter: TodoFilter.All,
  errorType: null,
  deletingTodoIds: [],
  updatingTodoIds: [],
  renamingTodoId: null,
};

export const fetchTodosPending
  = createAction('todos/fetchTodosPending');
export const fetchTodosFulfilled
  = createAction<Todo[]>('todos/fetchTodosSuccess');
export const fetchTodosRejected
  = createAction<string>('todos/fetchTodosFailure');

export const addTodoPending
  = createAction<{ title: string }>('todos/addTodoPending');
export const addTodoFulfilled
  = createAction<Todo>('todos/addTodoFulfilled');
export const addTodoRejected
  = createAction<string>('todos/addTodoRejected');

export const deleteTodoPending
  = createAction<number>('todos/deleteTodoPending');
export const deleteTodoFulfilled
  = createAction<number>('todos/deleteTodoFulfilled');
export const deleteTodoRejected
  = createAction<TodoActionErrorPayload>('todos/deleteTodoRejected');

export const renameTodoPending
  = createAction<number>('todos/renameTodoPending');
export const renameTodoFulfilled
  = createAction<Todo>('todos/renameTodoFulfilled');
export const renameTodoRejected
  = createAction<string>('todos/renameTodoRejected');

export const setCompletionPending
  = createAction<number>(
    'todos/setCompletionPending',
  );
export const setCompletionFulfilled
  = createAction<{ id: number; completed: boolean }>(
    'todos/setCompletionFulfilled',
  );
export const setCompletionRejected
  = createAction<TodoActionErrorPayload>(
    'todos/setCompletionRejected',
  );

export const deleteAllCompletedTodosPending
  = createAction('todos/deleteAllCompletedTodosPending');
export const deleteAllCompletedTodosFulfilled
  = createAction('todos/deleteAllCompletedTodosFulfilled');
export const deleteAllCompletedTodosRejected
  = createAction<string>('todos/deleteAllCompletedTodosRejected');

export const triggerCompleteAllTodos
  = createAction('todos/triggerCompleteAllTodos');
export const completeAllTodosPending
  = createAction('todos/completeAllTodosPending');
export const completeAllTodosFulfilled
  = createAction('todos/completeAllTodosFulfilled');
export const completeAllTodosRejected
  = createAction<string>('todos/completeAllTodosRejected');

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.currentFilter = action.payload;
    },
    setTempTodo(state, action) {
      state.tempTodo = action.payload;
    },
    clearTempTodo(state) {
      state.tempTodo = null;
    },
    setInputValue: (state, action) => {
      state.inputValue = action.payload;
    },
    setErrorType: (state, action: PayloadAction<ErrorType>) => {
      state.errorType = action.payload;
    },
    clearErrorType: (state) => {
      state.errorType = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosPending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTodosFulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'idle';
        state.todos = action.payload;
      })
      .addCase(fetchTodosRejected, (state, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.error = action.payload;
        state.errorType = ErrorType.LoadError;
      })
      .addCase(addTodoPending, (state, action) => {
        state.status = 'loading';
        state.tempTodo = {
          title: action.payload.title,
          id: 0,
          completed: false,
          userId: USER_ID,
        };
      })
      .addCase(addTodoFulfilled, (state, action: PayloadAction<Todo>) => {
        state.status = 'idle';
        state.todos.push(action.payload);
      })
      .addCase(addTodoRejected, (
        state, action: PayloadAction<string | undefined>,
      ) => {
        state.status = 'failed';
        state.errorType = ErrorType.AddTodoError;
        state.error = action.payload ?? null;
      })
      .addCase(deleteTodoPending, (state, action: PayloadAction<number>) => {
        state.status = 'loading';
        state.deletingTodoIds.push(action.payload);
      })
      .addCase(deleteTodoFulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'idle';
        state.deletingTodoIds
          = state.deletingTodoIds.filter(id => id !== action.payload);

        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodoRejected, (
        state, action: PayloadAction<TodoActionErrorPayload>,
      ) => {
        state.status = 'failed';
        state.deletingTodoIds
          = state.deletingTodoIds.filter(id => id !== action.payload.todoId);
        state.errorType = ErrorType.DeleteTodoError;
        state.error = action.payload.errorMessage; // Set the error message
      })
      .addCase(renameTodoPending, (state, action: PayloadAction<number>) => {
        state.status = 'loading';
        state.renamingTodoId = action.payload;
      })
      .addCase(renameTodoFulfilled, (state, action: PayloadAction<Todo>) => {
        state.status = 'idle';
        const index
          = state.todos.findIndex(todo => todo.id === action.payload.id);

        if (index !== -1) {
          state.todos[index] = action.payload; // Update the todo with the new data
        }

        state.renamingTodoId = null;
      })
      .addCase(renameTodoRejected, (state, action: PayloadAction<string>) => {
        state.status = 'failed';
        state.errorType = ErrorType.UpdateTodoError;
        state.renamingTodoId = null;
        state.error = action.payload;
      })
      .addCase(setCompletionPending, (state, action: PayloadAction<number>) => {
        state.updatingTodoIds.push(action.payload);
      })
      .addCase(setCompletionFulfilled,
        (state, action: PayloadAction<{ id: number; completed: boolean }>) => {
          state.status = 'idle';
          const { id, completed } = action.payload;
          const existingTodo = state.todos.find(todo => todo.id === id);

          if (existingTodo) {
            existingTodo.completed = completed;
          }

          state.updatingTodoIds
            = state.updatingTodoIds.filter(todoId => todoId !== id);
        })
      .addCase(setCompletionRejected,
        (state, action: PayloadAction<TodoActionErrorPayload>) => {
          state.status = 'failed';
          const { todoId, errorMessage } = action.payload;

          state.updatingTodoIds
            = state.updatingTodoIds.filter(id => id !== todoId);
          state.error = errorMessage;
          state.errorType = ErrorType.UpdateTodoError;
        })
      .addCase(deleteAllCompletedTodosPending, (state) => {
        state.status = 'loading';
        const completedTodoIds
          = state.todos
            .filter(todo => todo.completed).map(todo => todo.id);

        state.deletingTodoIds.push(...completedTodoIds);
      })
      .addCase(deleteAllCompletedTodosFulfilled, (state) => {
        state.status = 'idle';
        state.todos = state.todos.filter(todo => !todo.completed);
        state.deletingTodoIds = [];
      })
      .addCase(deleteAllCompletedTodosRejected, (state) => {
        state.status = 'failed';
        state.errorType = ErrorType.DeleteTodoError;
        state.deletingTodoIds = [];
      })
      .addCase(completeAllTodosPending, (state) => {
        state.status = 'loading';
      })
      .addCase(completeAllTodosFulfilled, (state) => {
        state.status = 'idle';
        state.todos.forEach(todo => {
          if (!todo.completed) {
            todo.completed = true;
          }
        });
      })
      .addCase(completeAllTodosRejected,
        (state, action: PayloadAction<string>) => {
          state.errorType = ErrorType.UpdateTodoError;
          state.error = action.payload;
        });
  },
});

export const {
  setTempTodo,
  setInputValue,
  clearTempTodo,
  setFilter,
  setErrorType,
  clearErrorType,
} = todoSlice.actions;

export default todoSlice.reducer;
