import { createContext, useEffect, useReducer } from 'react';
import { Todo } from '../Types/Todo';
import { Status } from '../Types/Status';
import { getTodos } from '../api/todos';

const USER_ID = 56;

type Action =
  | { type: 'loadTodos'; payload: Todo[] }
  | { type: 'addTodo'; payload: Todo }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'errorMessage'; payload: string }
  | { type: 'hasError'; payload: boolean }
  | { type: 'setLoading'; payload: { isLoading: boolean; todoIds?: number[] } }
  | { type: 'filterBy'; payload: Status }
  | { type: 'changeTodo'; payload: Todo };

type State = {
  todos: Todo[];
  errorMessage?: string;
  loading: { isLoading: boolean; todoIds: number[] };
  filterBy: Status;
};

const initialState = {
  todos: [],
  errorMessage: '',
  loading: {
    isLoading: false,
    todoIds: [],
  },
  filterBy: Status.ALL,
};

export const StateContext = createContext<State>(initialState);
export const DispatchContext = createContext<(action: Action) => void>(
  () => {},
);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'loadTodos':
      return {
        ...state,
        todos: action.payload,
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

    case 'errorMessage':
      return {
        ...state,
        errorMessage: action.payload,
      };

    case 'hasError':
      return {
        ...state,
        hasError: action.payload,
      };

    case 'setLoading':
      if (action.payload.isLoading && action.payload.todoIds) {
        return {
          ...state,
          loading: {
            isLoading: action.payload.isLoading,
            todoIds: action.payload.todoIds,
          },
        };
      }

      return {
        ...state,
        loading: {
          isLoading: action.payload.isLoading,
          todoIds: [],
        },
      };

    case 'filterBy':
      return {
        ...state,
        filterBy: action.payload,
      };

    case 'changeTodo':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? action.payload : todo,
        ),
      };

    default:
      return state;
  }
};

type Props = {
  children: React.ReactNode;
};

export const GlobalStateProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getTodos(USER_ID).then(response =>
      dispatch({ type: 'loadTodos', payload: response }),
    );
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
