import { createContext, useReducer } from 'react';
import React from 'react';
import { Todo } from '../types/Todo';

export enum FilterOfTodos {
  'All',
  'Active',
  'Completed',
}

export type Action =
  | { type: 'setTodos'; payload: Todo[] }
  | { type: 'addTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: { id: number } }
  | { type: 'toggleTodo'; payload: { id: number } }
  | { type: 'allCompleted' }
  | { type: 'deleteAllCompleted' }
  | { type: 'filterTodos'; name: FilterOfTodos }
  | { type: 'editTodo'; payload: { id: number; title: string } }
  | { type: 'setError'; payload: string }
  | { type: 'addToLoading'; payload: { id: number } }
  | { type: 'removeFromLoading'; payload: { id: number } }
  | { type: 'setTempTodo'; payload: Todo | null };

export type State = {
  todos: Todo[];
  filterTodos: FilterOfTodos;
  error: string;
  loading: number[];
  tempTodo: Todo | null;
};

const initialState: State = {
  todos: [],
  filterTodos: FilterOfTodos.All,
  error: '',
  loading: [],
  tempTodo: null,
};

type InitialDispatch = (action: Action) => void;

const reducer = (state: State, action: Action): State => {
  let newState: State = state;

  switch (action.type) {
    case 'setTodos':
      newState = {
        ...state,
        todos: action.payload,
      };
      break;
    case 'addTodo':
      newState = {
        ...state,
        todos: [...state.todos, action.payload],
      };
      break;
    case 'deleteTodo':
      newState = {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id),
      };
      break;
    case 'toggleTodo':
      newState = {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }),
      };
      break;
    case 'allCompleted':
      newState = {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.completed === false) {
            return {
              ...todo,
              completed: true,
            };
          }

          if (state.todos.every(todo1 => todo1.completed === true)) {
            return {
              ...todo,
              completed: false,
            };
          }

          return todo;
        }),
      };
      break;
    case 'deleteAllCompleted':
      newState = {
        ...state,
        todos: state.todos.filter(todo => todo.completed === false),
      };
      break;
    case 'filterTodos':
      newState = {
        ...state,
        filterTodos: action.name,
      };
      break;
    case 'editTodo':
      newState = {
        ...state,
        todos: state.todos.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              title: action.payload.title,
            };
          } else {
            return item;
          }
        }),
      };
      break;
    case 'setError':
      newState = {
        ...state,
        error: action.payload,
      };
      break;
    case 'addToLoading':
      newState = {
        ...state,
        loading: [...state.loading, action.payload.id],
      };
      break;
    case 'removeFromLoading':
      newState = {
        ...state,
        loading: state.loading.filter(todo => todo !== action.payload.id),
      };
      break;
    case 'setTempTodo':
      newState = {
        ...state,
        tempTodo: action.payload,
      };
      break;
    default:
      newState = state;
  }

  return newState;
};

export const StateContext = createContext(initialState);
export const DispatchContext = createContext<InitialDispatch>(() => {});

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};
