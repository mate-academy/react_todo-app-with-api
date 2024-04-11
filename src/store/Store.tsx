import React, { useEffect, useReducer } from 'react';
import { USER_ID, getTodos } from '../api/todos';
import { FilterBy } from '../enums/FilterBy';
import { State } from '../types/State';
import { Action } from '../types/Action';
import { Todo } from '../types/Todo';

export const SUCCESS_MESSAGE = 'SUCCESS';

const initialState: State = {
  todos: [],
  sortBy: FilterBy.All,
  status: SUCCESS_MESSAGE,
};

const newTodo = (title: string, id: number): Todo => {
  return {
    id,
    userId: USER_ID,
    title,
    completed: false,
  };
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'SHOW_ALL':
      return {
        ...state,
        sortBy: FilterBy.All,
      };
    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload,
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      };
    case 'RESET_STATUS':
      return {
        ...state,
        status: SUCCESS_MESSAGE,
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    case 'MAKE_COMPLETED_TODOS':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.completed) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      };
    case 'MAKE_UNCOMPLETED_TODOS':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (!todo.completed) {
            return { ...todo, completed: !todo.completed };
          }

          return todo;
        }),
      };

    case 'ADD_NEW_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          newTodo(action.payload.title.trim(), action.payload.id),
        ],
      };
    case 'REMOVE_LOCAL_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
    case 'SHOW_ERROR_MESSAGE':
      return {
        ...state,
        status: action.payload.message,
      };
    case 'SHOW_COMPLETED':
      return {
        ...state,
        sortBy: FilterBy.Completed,
      };

    case 'SHOW_ACTIVE':
      return {
        ...state,
        sortBy: FilterBy.Active,
      };
    default:
      return state;
  }
}

export const DispatchContext = React.createContext<(action: Action) => void>(
  () => {},
);
export const StateContext = React.createContext<State>(initialState);

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos()
      .then(response => {
        return dispatch({ type: 'LOAD_TODOS', payload: response });
      })
      .catch(() =>
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to load todos' },
        }),
      );
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
