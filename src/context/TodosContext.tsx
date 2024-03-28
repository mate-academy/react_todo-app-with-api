import { createContext, useContext, useEffect, useReducer } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, getTodos, updateTodo } from '../api/todos';
import { wait } from '../utils/fetchClient';
import { Status } from '../types/Status';
import { TodoId } from '../types/TodoId';

type State = {
  todos: Todo[];
  tempTodo: Todo | null;
  todosError: string;
  filterStatus: string;
  currentId: TodoId[];
  addTodo: (todo: Todo) => void;
  handleDeleteTodo: (id: TodoId) => void;
  setTempTodo: (todo: Todo | null) => void;
  handleFilterTodo: (status: string) => void;
  handleSetError: (errorMessage: string) => void;
  handleUpdateTodo: (id: TodoId, todo: Todo) => void;
  handleToggleTodoCheck: (id: TodoId, todo: Todo, toggleVal: boolean) => void;
  handleDeletingTodo: (id: TodoId) => void;
};

const initialState: State = {
  todos: [],
  tempTodo: null,
  todosError: '',
  filterStatus: Status.All,
  currentId: [],
  addTodo: () => {},
  handleDeleteTodo: () => {},
  setTempTodo: () => {},
  handleFilterTodo: () => {},
  handleSetError: () => {},
  handleUpdateTodo: () => {},
  handleToggleTodoCheck: () => {},
  handleDeletingTodo: () => {},
};

type TodosContextType = State & {
  dispatch: React.Dispatch<Action>;
};

const TodosContext = createContext<TodosContextType>({
  ...initialState,
  dispatch: () => {},
});

type Action =
  | { type: 'todos/addTodo'; payload: Todo }
  | { type: 'todos/delete'; payload: TodoId }
  | { type: 'todos/loaded'; payload: Todo[] }
  | { type: 'todos/setTempTodo'; payload: Todo | null }
  | { type: 'todos/setFilterStatus'; payload: string }
  | { type: 'todos/setError'; payload: string }
  | { type: 'todos/updateTodo'; payload: { id: TodoId; todo: Todo } }
  | { type: 'todos/setCurrentId'; payload: number | null };

type Props = {
  children: React.ReactNode;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'todos/addTodo':
      return {
        ...state,
        todos: [...state.todos, action.payload],
      };

    case 'todos/updateTodo':
      return {
        ...state,
        todos: state.todos.map(todo => {
          if (todo.id === action.payload.id) {
            return {
              ...todo,
              ...action.payload.todo,
            };
          }

          return todo;
        }),
      };

    case 'todos/delete':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };

    case 'todos/loaded':
      return { ...state, todos: action.payload };

    case 'todos/setFilterStatus':
      return {
        ...state,
        filterStatus: action.payload,
      };

    case 'todos/setCurrentId':
      return {
        ...state,
        currentId: action.payload ? [...state.currentId, action.payload] : [],
      };

    case 'todos/setTempTodo':
      return {
        ...state,
        tempTodo: action.payload,
      };

    case 'todos/setError':
      return { ...state, todosError: action.payload };

    default:
      return state;
  }
}

const TodosProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { todos, filterStatus, todosError, tempTodo, currentId } = state;

  const handleSetError = (errorMessage: string) => {
    dispatch({ type: 'todos/setError', payload: errorMessage });

    wait(3000).then(() => dispatch({ type: 'todos/setError', payload: '' }));
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await getTodos();

        dispatch({ type: 'todos/loaded', payload: fetchedTodos });
      } catch {
        handleSetError('Unable to load todos');
      }
    };

    fetchTodos();
  }, []);

  const addTodo = (todo: Todo) => {
    dispatch({ type: 'todos/addTodo', payload: todo });
  };

  const handleUpdateTodo = (id: TodoId, todo: Todo) => {
    dispatch({ type: 'todos/updateTodo', payload: { id, todo } });
  };

  const handleDeleteTodo = (id: TodoId) => {
    dispatch({ type: 'todos/delete', payload: id });
  };

  const setTempTodo = (todo: Todo | null) => {
    dispatch({ type: 'todos/setTempTodo', payload: todo });
  };

  const handleFilterTodo = (status: string) => {
    dispatch({ type: 'todos/setFilterStatus', payload: status });
  };

  const handleToggleTodoCheck = async (
    todoId: TodoId,
    todo: Todo,
    toggleVal: boolean,
  ) => {
    dispatch({ type: 'todos/setCurrentId', payload: todoId });
    try {
      await updateTodo(todoId, { ...todo, completed: toggleVal });

      handleUpdateTodo(todoId, { ...todo, completed: toggleVal });
    } catch {
      handleSetError('Unable to update a todo');
    } finally {
      dispatch({ type: 'todos/setCurrentId', payload: null });
    }
  };

  const handleDeletingTodo = async (todoId: TodoId) => {
    dispatch({ type: 'todos/setCurrentId', payload: todoId });
    try {
      await deleteTodo(todoId);

      handleDeleteTodo(todoId);
    } catch {
      handleSetError('Unable to delete a todo');
    } finally {
      dispatch({ type: 'todos/setCurrentId', payload: null });
    }
  };

  return (
    <TodosContext.Provider
      value={{
        addTodo,
        todos,
        tempTodo,
        todosError,
        filterStatus,
        currentId,
        setTempTodo,
        handleDeleteTodo,
        handleFilterTodo,
        handleSetError,
        dispatch,
        handleUpdateTodo,
        handleToggleTodoCheck,
        handleDeletingTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

const useTodos = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('TodosContext was used outside of the PostProvider');
  }

  return context;
};

export { useTodos, TodosProvider };
