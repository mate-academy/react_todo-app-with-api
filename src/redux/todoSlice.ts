/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as actions from './todoActions';
import {
  Todo,
  TodoState,
  TodoFilter,
  ErrorType,
  TodoActionErrorPayload,
} from '../types';

import { USER_ID } from '../_utils/constants';

const initialState: TodoState = {
  todos: [],
  tempTodo: null,
  status: 'idle',
  error: null,
  errorType: null,
  isErrorVisible: false,
  currentFilter: TodoFilter.All,
  deletingTodoIds: [],
  updatingTodoIds: [],
  completingTodoIds: [],
  renamingTodoId: null,
};

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
    setErrorType: (state, action: PayloadAction<ErrorType>) => {
      state.errorType = action.payload;
    },
    clearErrorType: (state) => {
      state.errorType = null;
    },
    showError: (state) => {
      state.isErrorVisible = true;
    },
    hideError: (state) => {
      state.isErrorVisible = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actions.fetchTodosPending,
        (state) => {
          state.status = 'loading';
          state.error = null;
        })
      .addCase(actions.fetchTodosFulfilled,
        (state, action: PayloadAction<Todo[]>) => {
          state.status = 'idle';
          state.todos = action.payload;
        })
      .addCase(actions.fetchTodosRejected,
        (state, action: PayloadAction<string>) => {
          state.status = 'failed';
          state.error = action.payload;
          state.errorType = ErrorType.LoadError;
        })
      .addCase(actions.addTodoPending, (state, action) => {
        state.status = 'loading';
        state.tempTodo = {
          title: action.payload.title,
          id: 0,
          completed: false,
          userId: USER_ID,
        };
      })
      .addCase(actions.addTodoFulfilled,
        (state, action: PayloadAction<Todo>) => {
          state.status = 'idle';
          state.todos.push(action.payload);
        })
      .addCase(actions.addTodoRejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = 'failed';
          state.errorType = ErrorType.AddTodoError;
          state.error = action.payload ?? null;
        })
      .addCase(actions.deleteTodoPending,
        (state, action: PayloadAction<number>) => {
          state.status = 'loading';
          state.deletingTodoIds.push(action.payload);
        })
      .addCase(actions.deleteTodoFulfilled,
        (state, action: PayloadAction<number>) => {
          state.status = 'idle';
          state.deletingTodoIds
            = state.deletingTodoIds
              .filter(id => id !== action.payload);
          state.todos
            = state.todos
              .filter(todo => todo.id !== action.payload);
        })
      .addCase(actions.deleteTodoRejected,
        (state, action: PayloadAction<TodoActionErrorPayload>) => {
          state.status = 'failed';
          state.deletingTodoIds
            = state.deletingTodoIds
              .filter(id => id !== action.payload.todoId);
          state.errorType = ErrorType.DeleteTodoError;
          state.error = action.payload.errorMessage;
        })
      .addCase(actions.renameTodoPending,
        (state, action: PayloadAction<number>) => {
          state.status = 'loading';
          state.renamingTodoId = action.payload;
        })
      .addCase(actions.renameTodoFulfilled,
        (state, action: PayloadAction<Todo>) => {
          state.status = 'idle';
          const index
            = state.todos
              .findIndex(todo => todo.id === action.payload.id);

          if (index !== -1) {
            state.todos[index] = action.payload;
          }

          state.renamingTodoId = null;
        })
      .addCase(actions.renameTodoRejected,
        (state, action: PayloadAction<string>) => {
          state.status = 'failed';
          state.errorType = ErrorType.UpdateTodoError;
          state.renamingTodoId = null;
          state.error = action.payload;
        })
      .addCase(actions.setCompletionPending,
        (state, action: PayloadAction<number>) => {
          state.updatingTodoIds.push(action.payload);
        })
      .addCase(actions.setCompletionFulfilled,
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
      .addCase(actions.setCompletionRejected,
        (state, action: PayloadAction<TodoActionErrorPayload>) => {
          state.status = 'failed';
          const { todoId, errorMessage } = action.payload;

          state.updatingTodoIds
            = state.updatingTodoIds.filter(id => id !== todoId);
          state.error = errorMessage;
          state.errorType = ErrorType.UpdateTodoError;
        })
      .addCase(actions.deleteAllCompletedTodosPending,
        (state) => {
          state.status = 'loading';
          const completedTodoIds
            = state.todos
              .filter(todo => todo.completed).map(todo => todo.id);

          state.deletingTodoIds.push(...completedTodoIds);
        })
      .addCase(actions.deleteAllCompletedTodosFulfilled,
        (state) => {
          state.status = 'idle';
          state.todos = state.todos.filter(todo => !todo.completed);
          state.deletingTodoIds = [];
        })
      .addCase(actions.deleteAllCompletedTodosRejected,
        (state) => {
          state.status = 'failed';
          state.errorType = ErrorType.DeleteTodoError;
          state.deletingTodoIds = [];
        })
      .addCase(actions.completeUncompletedTodosPending, (state) => {
        state.status = 'loading';

        const uncompletedTodoIds
          = state.todos.filter(todo => !todo.completed).map(todo => todo.id);

        state.completingTodoIds.push(...uncompletedTodoIds);
      })
      .addCase(actions.completeUncompletedTodosFulfilled,
        (state, action: PayloadAction<Todo[]>) => {
          state.status = 'idle';
          const updatedTodos = action.payload;

          updatedTodos.forEach((updatedTodo) => {
            const todoIndex
              = state.todos.findIndex((todo) => todo.id === updatedTodo.id);

            if (todoIndex !== -1) {
              state.todos[todoIndex] = updatedTodo;
            }
          });
          state.completingTodoIds = [];
        })
      .addCase(actions.completeUncompletedTodosRejected,
        (state, action: PayloadAction<string>) => {
          state.status = 'failed';
          state.error = action.payload;
          state.errorType = ErrorType.DeleteTodoError;
          state.completingTodoIds = [];
        })
      .addCase(actions.toggleAllTodosPending, (state) => {
        state.status = 'loading';
        state.updatingTodoIds = state.todos.map(todo => todo.id);
      })
      .addCase(actions.toggleAllTodosFulfilled,
        (state, action: PayloadAction<Todo[]>) => {
          state.status = 'idle';
          const updatedTodos = action.payload;

          updatedTodos.forEach(updatedTodo => {
            const todoIndex
              = state.todos.findIndex(todo => todo.id === updatedTodo.id);

            if (todoIndex !== -1) {
              state.todos[todoIndex] = updatedTodo;
            }
          });
          state.updatingTodoIds = [];
        })
      .addCase(actions.toggleAllTodosRejected,
        (state, action: PayloadAction<string>) => {
          state.status = 'failed';
          state.error = action.payload;
          state.errorType = ErrorType.UpdateTodoError;
          state.updatingTodoIds = [];
        });
  },

});

export const {
  setTempTodo,
  clearTempTodo,
  setFilter,
  setErrorType,
  showError,
  hideError,
  clearErrorType,
} = todoSlice.actions;

export default todoSlice.reducer;
