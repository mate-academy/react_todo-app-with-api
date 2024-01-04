import {
  Dispatch,
  ReactNode, RefObject, SetStateAction, createContext,
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { getTodos, updateTodo } from '../api/todos';
import { Filter } from '../types/Filter';
import { USER_ID } from '../utils/userID';
import { ErrorType } from '../types/Error';

type TodosProps = {
  todos: Todo[];
  setTodos: Dispatch<SetStateAction<Todo[]>>
  visibleTodos: Todo[];
  taskName: string;
  setTaskName: (query: string) => void;
  filterBy: Filter;
  setFilterBy: (query: Filter) => void,
  countIncompleteTask: number;
  error: null | string;
  setError: (err: string | null) => void;
  visibleTasks: Todo[];
  isAddingTask: boolean;
  setIsAddingTask: (TF: boolean) => void;
  tempTodo: Todo | null;
  setTempTodo: (todo: Todo | null) => void;
  deletingTask: number[];
  setDeletingTask: Dispatch<SetStateAction<number[]>>
  togglingId: number[];
  setTogglingId: Dispatch<SetStateAction<number[]>>
  isEdited: number | null;
  setIsEdited: (id: number | null) => void;
  inputEditRef: RefObject<HTMLInputElement> | null;
  toggleTodo: () => void;
};

// const inputEditRef = useRef<HTMLInputElement>(null);

const TodosContext = createContext<TodosProps>({
  todos: [],
  setTodos: () => undefined,
  visibleTodos: [],
  taskName: '',
  setTaskName: () => undefined,
  filterBy: 'all',
  setFilterBy: () => undefined,
  countIncompleteTask: 0,
  error: null,
  setError: () => undefined,
  visibleTasks: [],
  isAddingTask: false,
  setIsAddingTask: () => undefined,
  tempTodo: null,
  setTempTodo: () => undefined,
  deletingTask: [],
  setDeletingTask: () => undefined,
  togglingId: [],
  setTogglingId: () => undefined,
  isEdited: null,
  setIsEdited: () => undefined,
  inputEditRef: null,
  toggleTodo: () => undefined,
});

type Props = {
  children: ReactNode;
};

const dataFilter = (data: Todo[], filtr: Filter) => {
  switch (filtr) {
    case 'active':
      return data.filter(task => !task.completed);
    case 'completed':
      return data.filter(task => task.completed);
    default:
      return data;
  }
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [taskName, setTaskName] = useState<string>('');
  const [filterBy, setFilterBy] = useState<Filter>('all');
  const [error, setError] = useState<null | string>(null);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [deletingTask, setDeletingTask] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [togglingId, setTogglingId] = useState<number[]>([]);
  const [isEdited, setIsEdited] = useState<number | null>(null);

  const visibleTasks = useMemo(() => {
    return dataFilter(todos, filterBy);
  }, [todos, filterBy]);

  const countIncompleteTask = useMemo(() => {
    return dataFilter(todos, 'active').length;
  }, [todos]);

  const inputEditRef = useRef<HTMLInputElement>(null);

  const toggleTodo = () => {
    if (isEdited) {
      updateTodo(isEdited, { title: inputEditRef.current?.value.trim() })
        .then(data => {
          const copy = [...todos];
          const index = todos.findIndex(el => el.id === isEdited);

          copy[index] = data;

          setTodos(copy);
          setIsAddingTask(false);
          setIsEdited(null);
        })
        .catch(() => {
          setError(ErrorType.update);
          inputEditRef.current?.focus();
        });
    }
  };

  const value = {
    todos,
    setTodos,
    taskName,
    setTaskName,
    filterBy,
    setFilterBy,
    countIncompleteTask,
    error,
    setError,
    visibleTodos,
    visibleTasks,
    isAddingTask,
    setIsAddingTask,
    tempTodo,
    setTempTodo,
    deletingTask,
    setDeletingTask,
    togglingId,
    setTogglingId,
    isEdited,
    setIsEdited,
    inputEditRef,
    toggleTodo,
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(data => {
        setTodos(data);
        setVisibleTodos(data);
      })
      .catch(() => setError(ErrorType.load));
  }, []);

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => useContext(TodosContext);
