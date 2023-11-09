/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useReducer } from 'react';

import * as todoService from '../../api/todos';

import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';
import { TodoError } from '../../types/TodoError';

export const USER_ID = 11722;

enum ReducerActions {
  LoadTodos = 'loadTodos',
  UpdateTodos = 'updateTodos',
  SelectFilter = 'selectFilter',
  AddTempTodo = 'addTempTodo',
  AddLoadingItemId = 'addLoadingItemId',
  ClearLoadingItemsId = 'clearLoadingItemsId',
  ToggleSubmitting = 'toggleSubmitting',
  ToggleUpdating = 'toggleUpdating',
  ToggleDeleting = 'toggleDeleting',
  ToggleEditing = 'toggleEditing',
  AddTodoError = 'addTodoError',
  ClearTodoErrors = 'clearTodoErrors',
}

interface Action {
  type: ReducerActions;
  payload?: any;
}

interface State {
  initialTodos: Todo[];
  selectedFilter: Filter;
  tempTodo: Todo | null;
  loadingItemsId: number[];
  isSubmitting: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isEditing: boolean;
  todoError: TodoError | null;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ReducerActions.LoadTodos:
      return {
        ...state,
        initialTodos: action.payload,
      };

    case ReducerActions.UpdateTodos: {
      let { initialTodos } = state;

      if (action.payload.add) {
        initialTodos = [...initialTodos, action.payload.add];
      }

      if (action.payload.update) {
        const updatedTodos = [...initialTodos];
        const index = updatedTodos.findIndex(todo => (
          todo.id === action.payload.update.id
        ));

        updatedTodos.splice(index, 1, action.payload.update);
        initialTodos = updatedTodos;
      }

      if (action.payload.delete) {
        initialTodos = initialTodos
          .filter(todo => action.payload.delete !== todo.id);
      }

      return {
        ...state,
        initialTodos,
      };
    }

    case ReducerActions.SelectFilter:
      return {
        ...state,
        selectedFilter: action.payload,
      };

    case ReducerActions.AddTempTodo:
      return {
        ...state,
        tempTodo: action.payload,
      };

    case ReducerActions.AddLoadingItemId:
      return {
        ...state,
        loadingItemsId: [...state.loadingItemsId, action.payload],
      };

    case ReducerActions.ClearLoadingItemsId:
      return {
        ...state,
        loadingItemsId: [],
      };

    case ReducerActions.ToggleSubmitting:
      return {
        ...state,
        isSubmitting: !state.isSubmitting,
      };

    case ReducerActions.ToggleUpdating:
      return {
        ...state,
        isUpdating: !state.isUpdating,
      };

    case ReducerActions.ToggleDeleting:
      return {
        ...state,
        isDeleting: !state.isDeleting,
      };

    case ReducerActions.ToggleEditing:
      return {
        ...state,
        isEditing: action.payload,
      };

    case ReducerActions.AddTodoError:
      return {
        ...state,
        todoError: action.payload,
      };

    case ReducerActions.ClearTodoErrors:
      return {
        ...state,
        todoError: null,
      };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

interface UpdateState {
  add?: Todo,
  update?: Todo,
  delete?: number,
}

export const actionCreator = {
  load: (payload: Todo[]) => ({ type: ReducerActions.LoadTodos, payload }),
  updateTodos: (payload: UpdateState) => ({
    type: ReducerActions.UpdateTodos, payload,
  }),
  selectFilter: (payload: Filter) => ({
    type: ReducerActions.SelectFilter, payload,
  }),
  addTempTodo: (payload: Todo | null) => ({
    type: ReducerActions.AddTempTodo, payload,
  }),
  addLoadingItemId: (payload: number) => ({
    type: ReducerActions.AddLoadingItemId, payload,
  }),
  clearLoadingItemsId: () => ({ type: ReducerActions.ClearLoadingItemsId }),
  toggleSubmitting: () => ({ type: ReducerActions.ToggleSubmitting }),
  toggleUpdating: () => ({ type: ReducerActions.ToggleUpdating }),
  toggleDeleting: () => ({ type: ReducerActions.ToggleDeleting }),
  toggleEditing: (payload: boolean) => ({
    type: ReducerActions.ToggleEditing, payload,
  }),
  addError: (payload: TodoError) => ({
    type: ReducerActions.AddTodoError, payload,
  }),
  clearError: () => ({ type: ReducerActions.ClearTodoErrors }),
};

const initialState: State = {
  initialTodos: [],
  selectedFilter: Filter.All,
  tempTodo: null,
  loadingItemsId: [],
  isSubmitting: false,
  isUpdating: false,
  isDeleting: false,
  isEditing: false,
  todoError: null,
};

export const StateContext = React.createContext(initialState);
export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => {},
);

type Props = {
  children: React.ReactNode;
};

export const TodoAppContext: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch(actionCreator.clearError());
    todoService.getTodos(USER_ID)
      .then(todos => dispatch(actionCreator.load(todos)))
      .catch(() => {
        dispatch(actionCreator.addError(TodoError.ErrorLoad));
      });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
