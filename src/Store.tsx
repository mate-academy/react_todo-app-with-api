import React, { createContext, useEffect, useReducer } from 'react';
import { Action } from './types/Action';
import { Filter } from './types/Filter';
import { State } from './types/State';
import { getTodos } from './api/todos';

const initialState: State = {
  todos: [],
  errorMessage: '',
  filter: Filter.All,
  tempTodo: null,
  shouldFocus: null,
  toggleAll: false,
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setTodos':
      return {
        ...state,
        todos: action.todos,
      };

    case 'add':
      return {
        ...state,
        todos: [...state.todos, action.todo],
      };

    case 'delete':
      return {
        ...state,
        todos: state.todos.filter(el => el.id !== action.id),
      };

    case 'edit':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.id) {
            return {
              ...todo,
              title: action.value,
            };
          }

          return todo;
        }),
      };

    case 'complete':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.id) {
            return { ...todo, completed: action.value };
          }

          return todo;
        }),
      };

    case 'toggleAll':
      return {
        ...state,
        todos: state.todos.map(todo => ({ ...todo, completed: action.value })),
      };

    case 'filter':
      return {
        ...state,
        filter: action.payload,
      };

    case 'clearCompleted':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.todo,
      };

    case 'setError':
      return {
        ...state,
        errorMessage: action.message,
      };

    case 'setLoadingTodo':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.id) {
            return { ...todo, isLoading: action.value };
          }

          return todo;
        }),
      };

    case 'setShouldFocus':
      return {
        ...state,
        shouldFocus: new Date(),
      };

    default:
      return state;
  }
};

export const StateContext = createContext<State>(initialState);
export const DispatchContext = createContext<(action: Action) => void>(
  () => {},
);

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todos = await getTodos();

        dispatch({ type: 'setTodos', todos });
      } catch (error) {
        dispatch({ type: 'setError', message: 'Unable to load todos' });
      }
    };

    fetchData();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
