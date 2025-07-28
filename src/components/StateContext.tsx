import React, { createContext, useEffect, useReducer, useRef } from 'react';
import { Action } from '../types/Action';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

type StateContextType = {
  todos: Todo[];
  toDoTitle: string;
  filter: FilterType;
  edittedTitle: string;
  focusOnInput: boolean;
  temporaryIds: number[];
  tempTodo: Omit<Todo, 'editted'> | null;
  errorMessage: string;
};

type RefContextType = {
  inputRef: React.RefObject<HTMLInputElement>;
};

const reducer = (state: StateContextType, action: Action): StateContextType => {
  switch (action.type) {
    case 'GET_TODOS':
      return {
        ...state,
        todos: action.todos,
      };
    case 'LOADING_TODOS':
      return {
        ...state,
        temporaryIds: action.id,
      };
    case 'SET_TEMPORARY_TODO':
      return {
        ...state,
        tempTodo: action.tempTodo,
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.newTodo],
        toDoTitle: '',
      };
    case 'WRITE_NEW_TITLE':
      return {
        ...state,
        toDoTitle: action.newTitle,
      };
    case 'CHANGE_STATUS':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.id) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id),
        focusOnInput: !state.focusOnInput,
      };
    case 'FILTER_TODOS':
      return {
        ...state,
        filter: action.filteredOptions,
      };
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.id) {
            return {
              ...todo,
              title: state.edittedTitle.trim(),
              editted: !todo.editted,
            };
          }

          return todo;
        }),
      };
    case 'CHANGE_TITLE':
      return {
        ...state,
        edittedTitle: action.changedTitle,
      };
    case 'HANDLE_ESCAPE':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.id) {
            return {
              ...todo,
              editted: !todo.editted,
            };
          }

          return todo;
        }),
      };
    case 'SHOW_ERROR':
      return {
        ...state,
        errorMessage: action.message,
        focusOnInput: !state.focusOnInput,
      };
    case 'FOCUS_ON_INPUT':
      return {
        ...state,
        focusOnInput: action.value,
      };
    case 'INPUT_ON_BLUR':
      return {
        ...state,
        todos: state.todos.map(t => {
          return {
            ...t,
            editted: false,
          };
        }),
      };
    default:
      return state;
  }
};

const visibleTodos = (): Todo[] => {
  const dataFromStorage = localStorage.getItem('todos');

  if (dataFromStorage === null) {
    return [];
  }

  try {
    return JSON.parse(dataFromStorage);
  } catch (e) {
    return [];
  }
};

const InitialState: StateContextType = {
  todos: visibleTodos(),
  toDoTitle: '',
  filter: FilterType.ALL,
  edittedTitle: '',
  focusOnInput: true,
  tempTodo: null,
  temporaryIds: [],
  errorMessage: '',
};

export const RefState: RefContextType = {
  inputRef: React.createRef<HTMLInputElement>(),
};

export const StateContext = createContext(InitialState);

export const RefContext = createContext(RefState);

type Props = {
  children: React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DispatchContext = createContext((_action: Action) => {});

export const GlobalStateProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, InitialState);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.removeItem('todos');
    localStorage.setItem('todos', JSON.stringify(state.todos));
  }, [state.todos]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <RefContext.Provider value={{ inputRef }}>
          {children}
        </RefContext.Provider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
