import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {
  deleteTodo, getTodos, sendTodo, updateTodo,
} from '../api/todos';
import { FilterEnum } from '../app.constants';
import { AuthContext } from '../components/Auth/AuthContext';
import { Todo } from '../types/Todo';

export interface StateTodo extends Todo {
  isLoading: boolean;
}

type State = {
  todos: null | StateTodo[],
  filteredTodos: null | StateTodo[],
  error: null | string,
  filter: FilterEnum,
  tempTodo: null | StateTodo,
};

type DispatchAction =
  { type: 'SET_TODOS', payload: StateTodo[] | null }
  | { type: 'SET_FILTER', payload: FilterEnum }
  | { type: 'SET_FILTERED_TODOS', payload: StateTodo[] | null }
  | { type: 'CREATE_TODO', payload: StateTodo }
  | { type: 'UPDATE_TODO', payload: Partial<StateTodo> & Pick<StateTodo, 'id'> }
  | { type: 'DELETE_TODO', payload: number }
  | { type: 'SET_ERROR', payload: string }
  | { type: 'CLEAR_ERROR', payload?: undefined }
  | { type: 'SET_TEMP_TODO', payload: StateTodo | null };

interface UseAppContextResult {
  state: State,
  actions: {
    loadTodos: () => Promise<void>;
    createTodo: (todo: Pick<Todo, 'title' | 'completed'>) => Promise<void>;
    filterTodos: (filter: FilterEnum) => Promise<void>;
    clearError: VoidFunction;
    setError: (error: string) => void;
    deleteTodo: (id: number) => Promise<void>
    updateTodo: (
      todo: Partial<StateTodo> & Pick<StateTodo, 'id'>
    ) => Promise<void>

  },
}

const AppContext = createContext<UseAppContextResult>(
  {} as UseAppContextResult,
);

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const user = useContext(AuthContext);
  const [
    {
      todos, filteredTodos, error, filter, tempTodo,
    },
    dispatch,
  ] = useReducer((
    prev: State,
    { type, payload }: DispatchAction,
  ) => {
    switch (type) {
      case 'SET_TODOS':
        return {
          ...prev,
          todos: payload,
        };

      case 'SET_FILTER':
        return {
          ...prev,
          filter: payload,
        };

      case 'SET_TEMP_TODO':
        return {
          ...prev,
          tempTodo: payload,
        };

      case 'SET_FILTERED_TODOS':
        return {
          ...prev,
          filteredTodos: payload,
        };

      case 'CREATE_TODO':
        return {
          ...prev,
          todos: [...prev.todos ?? [], payload],
        };

      case 'UPDATE_TODO':
        if (!prev.todos) {
          return prev;
        }

        return {
          ...prev,
          todos: prev.todos.map((todo) => (
            todo.id === payload.id
              ? { ...todo, ...payload }
              : todo
          )),
        };

      case 'DELETE_TODO':
        if (!prev.todos) {
          return prev;
        }

        return {
          ...prev,
          todos: prev.todos.filter((todo) => todo.id !== payload),
        };

      case 'SET_ERROR':
        return {
          ...prev,
          error: payload,
        };

      case 'CLEAR_ERROR':
        return {
          ...prev,
          error: null,
        };

      default:
        return prev;
    }
  }, {
    todos: null,
    filteredTodos: null,
    error: null,
    filter: FilterEnum.All,
    tempTodo: null,
  });

  const loadTodos = useCallback(async () => {
    let newTodos = null;

    if (!user) {
      return newTodos;
    }

    try {
      const todosFromServer = await getTodos(user.id);

      if (todosFromServer.length) {
        newTodos = todosFromServer;
      }
    } catch {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Unable to load a todos',
      });
    }

    return newTodos;
  }, [user, filter, dispatch]);

  const appFunctions = {
    loadTodos: async () => {
      const todosFromServer = await loadTodos();

      dispatch({
        type: 'SET_TODOS',
        payload: todosFromServer && todosFromServer.map(todo => (
          { ...todo, isLoading: false }
        )),
      });
    },

    createTodo: async (
      { title, completed }: Pick<Todo, 'title' | 'completed'>,
    ) => {
      if (!user) {
        return;
      }

      const normalizedTitle = title.trim();

      if (!normalizedTitle) {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Title can&apos;t be empty',
        });

        return;
      }

      dispatch({
        type: 'SET_TEMP_TODO',
        payload: {
          id: 0,
          userId: user.id,
          title,
          completed,
          isLoading: true,
        },
      });

      let todoFromServer = null;

      try {
        todoFromServer = await sendTodo({
          userId: user.id,
          title: normalizedTitle,
          completed,
        });
      } catch {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Unable to add a todo',
        });

        return;
      }

      dispatch({
        type: 'SET_TEMP_TODO',
        payload: null,
      });

      dispatch({
        type: 'CREATE_TODO',
        payload: { ...todoFromServer, isLoading: false },
      });
    },

    filterTodos: async (newFilter: FilterEnum) => {
      dispatch({
        type: 'SET_FILTER',
        payload: newFilter,
      });

      dispatch({
        type: 'SET_FILTERED_TODOS',
        payload: todos && todos.filter(({ completed }) => (
          {
            [FilterEnum.All]: true,
            [FilterEnum.Active]: !completed,
            [FilterEnum.Completed]: completed,
          }[newFilter]
        )),
      });
    },

    setError: (newError: string) => (
      dispatch({ type: 'SET_ERROR', payload: newError })
    ),

    clearError: () => (dispatch({ type: 'CLEAR_ERROR' })),

    deleteTodo: async (id: number) => {
      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          id,
          isLoading: true,
        },
      });

      try {
        await deleteTodo(id);
      } catch {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Unable to delete a todo',
        });

        dispatch({
          type: 'UPDATE_TODO',
          payload: {
            id,
            isLoading: false,
          },
        });

        return;
      }

      dispatch({
        type: 'DELETE_TODO',
        payload: id,
      });
    },

    updateTodo: async (
      { id, ...rest }: Partial<StateTodo> & Pick<StateTodo, 'id'>,
    ) => {
      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          id,
          isLoading: true,
        },
      });

      try {
        await updateTodo({ id, ...rest });
      } catch {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Unable to update a todo',
        });

        dispatch({
          type: 'UPDATE_TODO',
          payload: {
            id,
            isLoading: false,
          },
        });

        return;
      }

      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          id,
          isLoading: false,
          ...rest,
        },
      });
    },
  };

  useEffect(() => {
    appFunctions.loadTodos();
  }, [user]);

  useEffect(() => {
    appFunctions.filterTodos(filter);
  }, [todos]);

  return (
    <AppContext.Provider
      value={{
        state: {
          todos,
          filteredTodos,
          error,
          filter,
          tempTodo,
        },
        actions: appFunctions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => (useContext(AppContext));
