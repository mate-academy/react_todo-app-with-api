import React, { createContext, useReducer } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { AppState } from '../types/AppState';
import { Errors } from '../types/Errors';

type Action =
  | { type: 'addTodo'; payload: Todo }
  | { type: 'filterBy'; payload: Filter }
  | { type: 'toggleAll' }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'toggleStatus'; payload: number }
  | { type: 'updateTodo'; payload: Omit<Todo, 'completed'> }
  | { type: 'error'; payload: Errors }
  | { type: 'loadingTodos'; payload: number[] }
  | { type: 'addTempTodo'; payload: Todo | null }
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'setEdited'; payload: boolean };

const reducer = (state: AppState, action: Action): AppState => {
  let todos = state.todos;

  switch (action.type) {
    case 'addTodo':
      todos = [...state.todos, action.payload];
      break;

    case 'filterBy':
      return {
        ...state,
        filter: action.payload,
      };

    case 'toggleAll':
      const shouldBe = state.todos.some(todo => !todo.completed);

      todos = state.todos.map(todo => {
        return { ...todo, completed: shouldBe };
      });
      break;

    case 'deleteTodo':
      todos = state.todos.filter(todo => todo.id !== action.payload);
      break;

    case 'toggleStatus':
      todos = state.todos.map(todo => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed };
        }

        return todo;
      });
      break;

    case 'updateTodo':
      todos = state.todos.map(todo => {
        if (todo.id === action.payload.id) {
          return { ...todo, title: action.payload.title };
        }

        return todo;
      });
      break;

    case 'error':
      return {
        ...state,
        error: action.payload,
      };

    case 'loadingTodos':
      return {
        ...state,
        loadingTodos: action.payload,
      };

    case 'addTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'setTodos':
      todos = action.payload;
      break;

    default:
      return state;
  }

  return {
    ...state,
    todos: todos,
  };
};

const INITIAL_STATE: AppState = {
  todos: [],
  error: Errors.noError,
  filter: Filter.all,
  loadingTodos: [],
  tempTodo: null,
};

export const StateContext = createContext(INITIAL_STATE);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DispatchContext = createContext((_action: Action) => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
