import {
  FC, createContext, useContext, useEffect, useReducer,
} from 'react';
import { Todo } from '../types/Todo';
import { getTodos } from '../api/todos';
import { USER_ID } from '../utils/userId';
import { ActionType } from '../types/ActionType';
import { Errors } from '../types';

type Action =
  {
    type: ActionType.SetTodos,
    payload: Todo[]
  }
  | {
    type: ActionType.SetTempTodo,
    payload: Todo | null
  }
  | {
    type: ActionType.SetInProcess,
    payload: number[]
  }
  | {
    type: ActionType.SetError,
    payload: { isError: boolean, errorMessage?: string }
  };

type State = {
  todos: Todo[]
  tempTodo: Todo | null
  inProcess: number[]
  isError: boolean
  errorMessage: string
  updateTodos: () => void
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.SetTodos:
      return { ...state, todos: action.payload };

    case ActionType.SetTempTodo:
      return { ...state, tempTodo: action.payload };

    case ActionType.SetInProcess:
      return { ...state, inProcess: action.payload };

    case ActionType.SetError:
      return {
        ...state,
        isError: action.payload.isError,
        errorMessage: action.payload.errorMessage || state.errorMessage,
      };

    default:
      return state;
  }
}

const initialState: State = {
  todos: [],
  tempTodo: null,
  inProcess: [],
  isError: false,
  errorMessage: '',
  updateTodos: () => { },
};

const StateContext = createContext(initialState);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DispatchContext = createContext((_action: Action) => { });

export const useSelector = () => useContext(StateContext);

export const useDispatch = () => useContext(DispatchContext);

type Props = {
  children: React.ReactNode
};

export const GlobalStateProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTodos = () => {
    getTodos(USER_ID)
      .then(todos => {
        dispatch({
          type: ActionType.SetTodos,
          payload: todos,
        });
      })
      .catch(() => {
        dispatch({
          type: ActionType.SetError,
          payload: {
            isError: true,
            errorMessage: Errors.UnableLoad,
          },
        });
      });
  };

  const updateTodos = () => {
    fetchTodos();
  };

  useEffect(() => {
    const timeoutId = 0;

    if (state.isError) {
      setTimeout(() => {
        dispatch({
          type: ActionType.SetError,
          payload: {
            isError: false,
          },
        });
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [state.isError]);

  useEffect(fetchTodos, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={{ ...state, updateTodos }}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
};
