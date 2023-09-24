import {
  createContext, useEffect, useReducer,
} from 'react';
import { TodoType } from '../../types/TodoType';
import { StatusType } from '../../types/Status';
import * as todoService from '../../api/todos';

const USER_ID = 11549;

type Action =
  { type: 'SET_TODOS', payload: TodoType[] }
  | { type: 'ADD_TODO', payload: TodoType }
  | { type: 'EDIT_TODO', payload: { id: number, title: string } }
  | { type: 'DELETE_TODO', payload: number }
  | { type: 'SET_ERROR', payload: string }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_SELECTED', payload: number }
  | { type: 'CLEAR_SELECTED' }
  | { type: 'SET_FILTER', payload: StatusType }
  | { type: 'SET_TEMP_TODO', payload: TodoType | null }
  | { type: 'TOGGLE_TODO', payload: number };

interface State {
  userId: number;
  todos: TodoType[];
  filter: StatusType;
  loading: boolean;
  error: string;
  tempTodo: TodoType | null;
  selectedTodoIds: number[];
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TODOS':
      return {
        ...state,
        todos: action.payload,
      };

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return {
              ...todo,
              title: action.payload.title,
            };
          }

          return todo;
        }),
      };

    case 'SET_TEMP_TODO':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'SET_SELECTED':
      return {
        ...state,
        selectedTodoIds: [...state.selectedTodoIds, action.payload],
      };

    case 'CLEAR_SELECTED':
      return {
        ...state,
        selectedTodoIds: [],
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        }),
      };

    default:
      return state;
  }
};

const initialState: State = {
  userId: USER_ID,
  todos: [],
  filter: StatusType.All,
  loading: false,
  error: '',
  tempTodo: null,
  selectedTodoIds: [],
};

export const StateContext = createContext(initialState);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DispatchContext = createContext(((_action: Action) => { }));

type Props = {
  children: React.ReactNode;
};

export const StateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });

    todoService.getTodos(USER_ID)
      .then((todos) => {
        dispatch({ type: 'SET_TODOS', payload: todos });
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load todos' });
      })
      .finally(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      });
  },
  [USER_ID]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>

  );
};
