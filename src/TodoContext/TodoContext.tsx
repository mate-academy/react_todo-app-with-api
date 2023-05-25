import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getTodos } from '../api/todos';
import { USER_ID } from '../consfig';
import { NewError } from '../types/ErrorsList';
import { Todo } from '../types/Todo';
import { Status } from '../types/TodoFilter';

interface TodoContextInterface {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  tempTodo: Todo | null;
  setTempTodo: Dispatch<SetStateAction<Todo | null>>;
  filterBy: Status;
  setFilterBy: Dispatch<SetStateAction<Status>>;
  visibleError: NewError | null
  setVisibleError: Dispatch<SetStateAction<NewError | null>>;
  isRemovingCompleted: boolean
  setIsRemovingCompleted: Dispatch<SetStateAction<boolean>>;
  updatingTodoId: number | null
  setUpdatingTodoId: Dispatch<SetStateAction<number | null>>;
  isUpdatingEveryStatus: boolean
  setIsUpdatingEveryStatus: Dispatch<SetStateAction<boolean>>;
  isTodosNoEmpty: boolean;
  isEveryTotoCompleted: boolean;
}

export const TodoContext = createContext<TodoContextInterface>({
  todos: [],
  setTodos: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  filterBy: Status.All,
  setFilterBy: () => {},
  visibleError: null,
  setVisibleError: () => {},
  isRemovingCompleted: false,
  setIsRemovingCompleted: () => {},
  updatingTodoId: null,
  setUpdatingTodoId: () => {},
  isUpdatingEveryStatus: false,
  setIsUpdatingEveryStatus: () => {},
  isTodosNoEmpty: false,
  isEveryTotoCompleted: false,
});

export const useTodoContext = () => useContext(TodoContext);

export const TodoProvider: FC<PropsWithChildren> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<Status>(Status.All);
  const [visibleError, setVisibleError] = useState<NewError | null>(null);
  const [isRemovingCompleted, setIsRemovingCompleted] = useState(false);
  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);
  const [isUpdatingEveryStatus, setIsUpdatingEveryStatus] = useState(false);

  const isTodosNoEmpty = todos.length > 0;
  const isEveryTotoCompleted = todos.every((todo) => todo.completed);

  const loadTodo = useCallback(async () => {
    const todosFromServer = await getTodos(USER_ID);

    setTodos(todosFromServer);
  }, []);

  useEffect(() => {
    loadTodo();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisibleError(null);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [visibleError]);

  const contextValue = {
    todos,
    setTodos,
    tempTodo,
    setTempTodo,
    filterBy,
    setFilterBy,
    visibleError,
    setVisibleError,
    isRemovingCompleted,
    setIsRemovingCompleted,
    updatingTodoId,
    setUpdatingTodoId,
    isUpdatingEveryStatus,
    setIsUpdatingEveryStatus,
    isTodosNoEmpty,
    isEveryTotoCompleted,
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};
