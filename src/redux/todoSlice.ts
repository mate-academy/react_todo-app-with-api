/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  Todo,
  TodoFilter,
  ErrorType,
  DeleteTodoRejectedPayload,
} from '../types';

import { USER_ID } from '../_utils/constants';

export interface TodoState {
  todos: Todo[];
  tempTodo: Todo | null;
  inputValue: string,
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  filter: TodoFilter;
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
  filter: TodoFilter.All,
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
  = createAction<DeleteTodoRejectedPayload>('todos/deleteTodoRejected');

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
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
        state.tempTodo = {
          title: action.payload.title,
          id: 0,
          completed: false,
          userId: USER_ID,
        };
        state.status = 'loading';
      })
      .addCase(addTodoFulfilled, (state, action: PayloadAction<Todo>) => {
        console.log(action.payload, 'api request to add todo fulfilled');
        state.todos.push(action.payload);
      })
      .addCase(addTodoRejected, (
        state, action: PayloadAction<string | undefined>,
      ) => {
        state.errorType = ErrorType.AddTodoError;
        state.error = action.payload ?? null;
      })
      .addCase(deleteTodoPending, (state, action: PayloadAction<number>) => {
        state.deletingTodoIds.push(action.payload);
      })
      .addCase(deleteTodoFulfilled, (state, action: PayloadAction<number>) => {
        state.deletingTodoIds
          = state.deletingTodoIds.filter(id => id !== action.payload);

        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodoRejected, (
        state, action: PayloadAction<DeleteTodoRejectedPayload>,
      ) => {
        state.deletingTodoIds
          = state.deletingTodoIds.filter(id => id !== action.payload.todoId);
        state.errorType = ErrorType.DeleteTodoError;
        state.error = action.payload.errorMessage; // Set the error message
      });
    // .addCase(renameTodo.pending, (state, action) => {
    //   state.renamingTodoId = action.meta.arg.todoId;
    // })
    // .addCase(renameTodo.fulfilled, (state, action) => {
    //   const index = state.todos
    //     .findIndex(todo => todo.id === action.payload.id);

    //   if (index !== -1) {
    //     state.todos[index].title = action.payload.title;
    //   }

    //   state.renamingTodoId = null;
    // })
    // .addCase(renameTodo.rejected, (state) => {
    //   state.errorType = ErrorType.UpdateTodoError;
    //   state.renamingTodoId = null;
    // })
    // .addCase(setCompletion.pending, (state, action) => {
    //   state.updatingTodoIds.push(action.meta.arg.todoId);
    // })
    // .addCase(setCompletion.fulfilled, (state, action) => {
    //   const { id, completed } = action.payload;
    //   const existingTodo = state.todos.find(todo => todo.id === id);

    //   if (existingTodo) {
    //     existingTodo.completed = completed;
    //   }

    //   state.updatingTodoIds = state.updatingTodoIds
    //     .filter(todoId => todoId !== id);
    // })
    // .addCase(setCompletion.rejected, (state, action) => {
    //   state.updatingTodoIds = state.updatingTodoIds
    //     .filter(todoId => todoId !== action.meta.arg.todoId);

    //   state.errorType = ErrorType.UpdateTodoError;
    // })
    // // .addCase(completeAllTodos.pending, (state) => {
    // //   // Handle the pending state if needed
    // // })
    // .addCase(completeAllTodos.fulfilled, (state) => {
    //   state.todos.forEach(todo => {
    //     if (!todo.completed) {
    //       todo.completed = true;
    //     }
    //   });
    // })
    // .addCase(completeAllTodos.rejected, (state) => {
    //   state.errorType = ErrorType.UpdateTodoError;
    // })
    // .addCase(deleteAllCompletedTodos.pending, (state) => {
    //   const completedTodoIds = state.todos
    //     .filter(todo => todo.completed)
    //     .map(todo => todo.id);

    //   state.deletingTodoIds.push(...completedTodoIds);
    // })
    // .addCase(deleteAllCompletedTodos.fulfilled, (state) => {
    //   state.todos = state.todos.filter(todo => !todo.completed);
    //   state.deletingTodoIds = [];
    // })
    // .addCase(deleteAllCompletedTodos.rejected, (state) => {
    //   state.errorType = ErrorType.DeleteTodoError;
    //   state.deletingTodoIds = [];
    // });
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

// import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

// // Define custom actions
// export const setTodosCompletedPending = createAction('todos/setTodosCompletedPending');
// export const setTodosCompletedSuccess = createAction<Todo[]>('todos/setTodosCompletedSuccess');
// export const setTodosCompletedFailure = createAction<string>('todos/setTodosCompletedFailure');

// // Define your initialState, reducers, and extraReducers...
// const todoSlice = createSlice({
//   name: 'todos',
//   initialState,
//   reducers: {
//     // Reducers...
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(setTodosCompletedPending, (state) => {
//         // Update state for pending
//       })
//       .addCase(setTodosCompletedSuccess, (state, action: PayloadAction<Todo[]>) => {
//         // Update state for success, mark todos as completed
//         action.payload.forEach(todo => {
//           const index = state.todos.findIndex(t => t.id === todo.id);
//           if (index !== -1) {
//             state.todos[index].completed = true;
//           }
//         });
//       })
//       .addCase(setTodosCompletedFailure, (state, action: PayloadAction<string>) => {
//         // Update state for failure
//         state.error = action.payload;
//       });
//     // Handle other actions...
//   },
// });

// export default todoSlice.reducer;
