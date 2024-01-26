import React, { useReducer } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type State = {
  errorMessage: string | null;
  todos: Todo[];
  clearAll: boolean;
  filterBy: Filter;
  isSubmitting: boolean;
  isEscapeKeyup: boolean;
  tempTodo: Todo | null,
};

type Props = {
  children: React.ReactNode;
};

export type Action
  = { type: 'saveTodos', payload: Todo[] }
  | { type: 'addTodo', payload: Todo }
  | { type: 'deleteTodo', payload: number }
  | { type: 'deleteAllCompleted' }
  | { type: 'updateTodo', payload: Todo }
  | { type: 'toggleAll', payload: boolean }
  | { type: 'setError', payload: string | null }
  | { type: 'clearAll', payload: boolean }
  | { type: 'setFilter', payload: Filter }
  | { type: 'setIsSubmitting', payload: boolean }
  | { type: 'setEscape', payload: boolean }
  | { type: 'setTempTodo', payload: Todo | null };

export const initialState: State = {
  errorMessage: null,
  todos: [],
  clearAll: false,
  filterBy: Filter.all,
  isSubmitting: false,
  isEscapeKeyup: false,
  tempTodo: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'saveTodos':
      return {
        ...state,
        todos: action.payload,
        tempTodo: null,
      };

    case 'addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'deleteTodo':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'deleteAllCompleted':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.completed === false),
      };

    case 'updateTodo':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return action.payload;
          }

          return todo;
        }),
      };

    case 'toggleAll':
      return {
        ...state,
        todos: state.todos.map(todo => {
          return {
            ...todo,
            completed: action.payload,
          };
        }),
      };

    case 'setError':
      return {
        ...state,
        errorMessage: action.payload,
      };

    case 'clearAll':
      return {
        ...state,
        clearAll: action.payload,
      };

    case 'setFilter':
      return {
        ...state,
        filterBy: action.payload,
      };

    case 'setIsSubmitting':
      return {
        ...state,
        isSubmitting: action.payload,
      };

    case 'setEscape':
      return {
        ...state,
        isEscapeKeyup: action.payload,
      };

    case 'setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    default:
      return state;
  }
}

export const StateContext = React.createContext(initialState);
export const DispatchContext
  = React.createContext((() => { }) as React.Dispatch<Action>);

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
