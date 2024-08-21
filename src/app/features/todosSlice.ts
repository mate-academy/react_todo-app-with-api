// eslint-disable-next-line import/no-extraneous-dependencies
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewTodo, Todo } from '../../types/Todo';
import { IsActiveError } from '../../types/types';
import { addTodo, deleteTodo, getTodos, updateTodo } from '../../api/todos';

const initialState = {
  todos: [] as Todo[],
  isProcessing: false,
  hasError: IsActiveError.NoError,
  isToggling: false,
  isClearing: false,
  processingTodoId: 0,
};

export interface UpdateTodos {
  newTodo: Todo;
  todoId: number;
}

export const loadTodos = createAsyncThunk('fetch/todos', () => getTodos());
export const addNewTodo = createAsyncThunk('add/todo', (newData: NewTodo) =>
  addTodo(newData),
);
export const changeTodo = createAsyncThunk('update/todo', (args: UpdateTodos) =>
  updateTodo(args.todoId, args.newTodo),
);
export const removeTodo = createAsyncThunk('delete/todo', (todoId: number) =>
  deleteTodo(todoId),
);

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setNewError: (state, action: PayloadAction<IsActiveError>) => ({
      ...state,
      hasError: action.payload,
    }),
    setNewTodos: (state, action: PayloadAction<Todo[]>) => ({
      ...state,
      todos: action.payload,
    }),
    setToggling: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isToggling: action.payload,
    }),
    setClearing: (state, action: PayloadAction<boolean>) => ({
      ...state,
      isClearing: action.payload,
    }),
  },

  extraReducers(builder) {
    builder.addCase(loadTodos.pending, state => {
      return {
        ...state,
        hasError: IsActiveError.NoError,
      };
    });
    builder.addCase(
      loadTodos.fulfilled,
      (state, action: PayloadAction<Todo[]>) => {
        return {
          ...state,
          todos: action.payload,
        };
      },
    );
    builder.addCase(loadTodos.rejected, state => {
      return {
        ...state,
        hasError: IsActiveError.Load,
      };
    });

    builder.addCase(addNewTodo.pending, state => {
      return { ...state, isProcessing: true, hasError: IsActiveError.NoError };
    });
    builder.addCase(
      addNewTodo.fulfilled,
      (state, action: PayloadAction<Todo>) => {
        return {
          ...state,
          todos: [...state.todos, action.payload],
          isProcessing: false,
        };
      },
    );
    builder.addCase(addNewTodo.rejected, state => {
      return {
        ...state,
        isProcessing: false,
        hasError: IsActiveError.Add,
      };
    });

    builder.addCase(changeTodo.pending, (state, action) => {
      return {
        ...state,
        isProcessing: true,
        hasError: IsActiveError.NoError,
        processingTodoId: action.meta.arg.todoId,
      };
    });
    builder.addCase(
      changeTodo.fulfilled,
      (state, action: PayloadAction<Todo>) => {
        const newList = state.todos.map(t => {
          return t.id === action.payload.id ? action.payload : t;
        });

        return {
          ...state,
          todos: newList,
          isProcessing: false,
          processingTodoId: 0,
        };
      },
    );
    builder.addCase(changeTodo.rejected, state => {
      return {
        ...state,
        isProcessing: false,
        hasError: IsActiveError.Update,
        processingTodoId: 0,
      };
    });

    builder.addCase(removeTodo.pending, (state, action) => {
      return {
        ...state,
        isProcessing: true,
        processingTodoId: action.meta.arg,
        hasError: IsActiveError.NoError,
      };
    });
    builder.addCase(removeTodo.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      const newList = state.todos.filter(t => t.id !== deletedId);

      return {
        ...state,
        isProcessing: false,
        todos: newList,
        processingTodoId: 0,
      };
    });
    builder.addCase(removeTodo.rejected, state => {
      return {
        ...state,
        isProcessing: false,
        processingTodoId: 0,
        hasError: IsActiveError.Delete,
      };
    });
  },
});

export const { setNewError, setNewTodos, setToggling, setClearing } =
  todosSlice.actions;
