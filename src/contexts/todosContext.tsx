import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { TodoType } from '../types/Todo';
import {
  getTodos, postTodo, deleteTodo, updateTodo,
} from '../api/todos';

type TodosMap = {
  all: TodoType[];
  completed: TodoType[];
  active: TodoType[];
};

type ContextValue = {
  todosMap: TodosMap;
  tempTodo: TodoType | null;
  processedTodos: TodoType[];
  error: string;
  isLoading: boolean;
  handleClearCompleted: () => Promise<void>;
  handleToggleCompleted: (todo: TodoType) => void;
  handleDeleteTodo: (todo: TodoType) => void;
  handleAddTodo: (title: string) => void;
  addToProcessed: (todos: TodoType[]) => void;
  handleToggleCompletedAll: () => Promise<void>;
  handleTitleUpdate: (todo: TodoType, value: string) => void;
};

const TodosContext = createContext<ContextValue | undefined>(undefined);

type State = {
  todos: TodoType[];
  processedTodos: TodoType[];
  isLoading: boolean;
  error: string;
  tempTodo: TodoType | null;
};

type Action =
  | { type: 'loading' }
  | { type: 'processedTodos'; payload: TodoType[] }
  | { type: 'todos/loaded'; payload: TodoType[] }
  | { type: 'addTodo/loading'; payload: TodoType }
  | { type: 'addTodo/loaded'; payload: TodoType }
  | { type: 'deleteTodo'; payload: number }
  | { type: 'updateTodo'; payload: TodoType }
  | { type: 'failed'; payload: string };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'processedTodos':
      return { ...state, processedTodos: action.payload, isLoading: true };
    case 'todos/loaded':
      return { ...state, isLoading: false, todos: action.payload };
    case 'addTodo/loading':
      return {
        ...state,
        isLoading: true,
        tempTodo: action.payload,
        processedTodos: [action.payload],
      };
    case 'addTodo/loaded':
      return {
        ...state,
        isLoading: false,
        tempTodo: null,
        todos: [...state.todos, action.payload],
      };
    case 'deleteTodo':
      return {
        ...state,
        isLoading: false,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
        processedTodos: [],
      };
    case 'updateTodo':
      return {
        ...state,
        isLoading: false,
        // eslint-disable-next-line max-len
        todos: state.todos.map((todo) => (todo.id === action.payload.id ? action.payload : todo)),
        processedTodos: [],
      };
    case 'failed':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        tempTodo: null,
        processedTodos: [],
      };
    default:
      return state;
  }
};

type TodosProviderProps = {
  children: React.ReactNode;
  userId: number;
};

const initialState = {
  todos: [],
  tempTodo: null,
  isLoading: false,
  error: '',
  processedTodos: [],
};

export const TodosProvider = ({
  userId,
  children,
}: React.PropsWithChildren<TodosProviderProps>) => {
  const [{
    todos, isLoading, error, tempTodo, processedTodos,
  }, dispatch]
    = useReducer(reducer, initialState);

  const todosMap: TodosMap = useMemo(
    () => todos.reduce(
      (acc, nextTodo) => {
        const todoMapKey = nextTodo.completed ? 'completed' : 'active';

        return {
          ...acc,
          [todoMapKey]: [...acc[todoMapKey], nextTodo],
        };
      },
      {
        all: todos,
        completed: [],
        active: [],
      },
    ),
    [todos],
  );

  const addToProcessed = useCallback(
    (processingTodos: TodoType[]) => dispatch({
      type: 'processedTodos',
      payload: processingTodos,
    }),
    [],
  );

  const showError = useCallback((errorMsg: string) => {
    dispatch({ type: 'failed', payload: errorMsg });

    setTimeout(() => {
      dispatch({ type: 'failed', payload: '' });
    }, 3000);
  }, []);

  useEffect(() => {
    if (userId) {
      dispatch({ type: 'loading' });

      getTodos(userId)
        .then((data) => dispatch({ type: 'todos/loaded', payload: data }))
        .catch(() => showError('Unable to load todos'));
    }
  }, [userId]);

  const handleAddTodo = useCallback(
    (title: string) => {
      if (!title) {
        showError("Title can't be empty");

        return;
      }

      const body = {
        title,
        userId,
        completed: false,
      };

      dispatch({
        type: 'addTodo/loading',
        payload: {
          ...body,
          id: 0,
        },
      });

      postTodo(userId, body)
        .then((todo) => dispatch({ type: 'addTodo/loaded', payload: todo }))
        .catch(() => showError('Unable to add a todo'));
    },
    [userId],
  );

  const handleDeleteTodo = useCallback((todo: TodoType) => {
    deleteTodo(todo.id)
      .then(() => dispatch({ type: 'deleteTodo', payload: todo.id }))
      .catch(() => showError('Unable to delete a todo'));
  }, []);

  const handleToggleCompleted = useCallback(
    (todo: TodoType) => {
      updateTodo(todo.id, { completed: !todo.completed })
        .then((data) => dispatch({ type: 'updateTodo', payload: data }))
        .catch(() => showError('Unable to update a todo'));
    },
    [],
  );

  const handleTitleUpdate = useCallback(
    (todo: TodoType, value: string) => {
      addToProcessed([todo]);

      updateTodo(todo.id, { title: value })
        .then((data) => dispatch({ type: 'updateTodo', payload: data }))
        .catch(() => showError('Unable to update a todo'));
    },
    [],
  );

  const handleClearCompleted = useCallback(async () => {
    addToProcessed(todosMap.completed);

    try {
      await Promise.all(
        todosMap.completed.map((todo) => handleDeleteTodo(todo)),
      );
    } catch {
      showError('Unable to clear completed Todos');
    }
  }, [todosMap]);

  const handleToggleCompletedAll = useCallback(async () => {
    const toProcess
      = todosMap.active.length > 0 ? todosMap.active : todosMap.completed;

    addToProcessed(toProcess);

    try {
      await Promise.all(toProcess.map((todo) => handleToggleCompleted(todo)));
    } catch {
      showError('Unable to clear completed Todos');
    }
  }, [todosMap]);

  const value = {
    todosMap,
    processedTodos,
    tempTodo,
    error,
    isLoading,
    handleClearCompleted,
    handleToggleCompleted,
    handleDeleteTodo,
    handleAddTodo,
    addToProcessed,
    handleToggleCompletedAll,
    handleTitleUpdate,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);

  return context as ContextValue;
};
