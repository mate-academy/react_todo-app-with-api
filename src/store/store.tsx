import React, { useEffect, useReducer } from 'react';
import * as todoService from '../api/todos';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ActionType } from '../types/ActionType';
import { Todo } from '../types/Todo';
import { Filters } from '../types/Filters';
import { ShowError } from '../types/ShowErrors';

const KEY = 'todos';

type Action = { type: ActionType.GetTodos, payload: Todo[] }
| { type: ActionType.SetError, payload: ShowError }
| { type: ActionType.ClearError }
| { type: ActionType.SetTempTodo, payload: Todo }
| { type: ActionType.ClearTempTodo }
// | { type: ActionType.SetIsLoading }
// | { type: ActionType.ClearIsLoading }
| { type: ActionType.SetLoadingIDs, payload: number[] }
| { type: ActionType.ClearLoadingIDs }
| { type: ActionType.Create, payload: Todo }
| { type: ActionType.Update, payload: Todo }
| { type: ActionType.Delete, payload: number }
| { type: ActionType.Toggle, payload: number }
| { type: ActionType.ToggleAllTodos }
| { type: ActionType.ClearCompletedTodos }
| { type: ActionType.SetFilter, payload: Filters };

type State = {
  todos: Todo[],
  filter: Filters,
  error: ShowError | null,
  tempTodo: Todo | null,
  // isLoading: boolean
  loadingIDs: number[] | null,
};

function Reducer(state: State, action:Action):State {
  switch (action.type) {
    case ActionType.GetTodos: {
      return { ...state, todos: action.payload };
    }

    case ActionType.SetError: {
      return { ...state, error: action.payload };
    }

    case ActionType.ClearError: {
      return { ...state, error: null };
    }

    case ActionType.SetTempTodo: {
      return { ...state, tempTodo: action.payload };
    }

    case ActionType.ClearTempTodo: {
      return { ...state, tempTodo: null };
    }

    // case ActionType.SetIsLoading: {
    //   return { ...state, isLoading: true };
    // }

    // case ActionType.ClearIsLoading: {
    //   return { ...state, isLoading: false };
    // }

    case ActionType.SetLoadingIDs: {
      return { ...state, loadingIDs: action.payload };
    }

    case ActionType.ClearLoadingIDs: {
      return { ...state, loadingIDs: null };
    }

    case ActionType.Create: {
      const newTodos = [...state.todos, action.payload];

      return { ...state, todos: newTodos };
    }

    case ActionType.Update: {
      const newTodos = state.todos.map(todo => (
        todo.id === action.payload.id
          ? {
            ...todo,
            title: action.payload.title,
            completed: action.payload.completed,
          }
          : todo
      ));

      return { ...state, todos: newTodos };
    }

    case ActionType.Delete: {
      const newTodos = state.todos
        .filter(todo => todo.id !== action.payload);

      return { ...state, todos: newTodos };
    }

    case ActionType.Toggle: {
      const newTodos = state.todos.map(todo => (
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      ));

      return { ...state, todos: newTodos };
    }

    case ActionType.ToggleAllTodos: {
      const newTodos = state.todos.map(todo => (
        { ...todo, completed: !todo.completed }
      ));

      return { ...state, todos: newTodos };
    }

    case ActionType.ClearCompletedTodos: {
      const newTodos = state.todos
        .filter(todo => !todo.completed);

      return { ...state, todos: newTodos };
    }

    case ActionType.SetFilter: {
      return { ...state, filter: action.payload };
    }

    default:
      return state;
  }
}

const initialState:State = {
  todos: [],
  filter: Filters.All,
  error: null,
  tempTodo: null,
  // isLoading: false,
  loadingIDs: null,
};

export const StateContext = React.createContext(initialState);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DispatchContext = React
  .createContext<(action: Action) => void>(() => {});

type Props = {
  children: React.ReactNode
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [localStorage, setLocalStorage] = useLocalStorage(KEY,
    initialState.todos);

  const [state, dispatch] = useReducer(Reducer, {
    ...initialState,
    todos: localStorage,
  });

  useEffect(() => {
    setLocalStorage(state.todos);
  }, [setLocalStorage, state.todos]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch({ type: ActionType.ClearError });
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [state.error]);

  useEffect(() => {
    todoService.getTodos()
      .then(newTodos => dispatch({
        type: ActionType.GetTodos,
        payload: newTodos,
      }))
      .catch(() => dispatch({
        type: ActionType.SetError,
        payload: ShowError.fetchTodos,
      }));
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
