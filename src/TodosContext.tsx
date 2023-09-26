import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';

interface TodosContextType {
  filteredTodos: Todo[],
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  error: string;
  setError: (error: string) => void;
  filter: Filter,
  setFilter: (filter: Filter) => void;
  USER_ID: number;
  loadTodos: () => void;
  tempTodos: Todo[];
  setTempTodos: (todos: Todo[]) => void;
  handlerTitleFieldFocused: (status: boolean) => void;
  handleToggleAllTodos: () => void;
  handleAddTodo: (title: string) => Promise<boolean | undefined>;
  handleUpdateTodo: (todo: Todo) => Promise<boolean>;
  handleDeleteTodo: (todo: Todo) => void;
  isAllTodosCompleted: boolean;
  isTitleFieldFocused: boolean;
}

type Props = {
  children: React.ReactNode,
};

const USER_ID = 11478;

export const TodosContext = createContext({} as TodosContextType);

export const TodosContextProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodos, setTempTodos] = useState<Todo[]>([] as Todo[]);
  const [isTitleFieldFocused, setIsTitleFieldFocused] = useState(true);
  const [error, setError] = useState('');

  const isAllTodosCompleted = todos.every(todo => todo.completed);

  const filteredTodos: Todo[] = useMemo(() => todos.filter(({ completed }) => {
    switch (filter) {
      case Filter.Active:
        return !completed;
      case Filter.Completed:
        return completed;
      default:
        return true;
    }
  }), [filter, todos, tempTodos]);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setError('');
    }, 3000);
  }, [error]);

  const loadTodos = async () => {
    try {
      setError('');
      const fetchedTodos = await getTodos(USER_ID);

      setTodos(fetchedTodos);
    } catch {
      setError('Unable to load todos');
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handlerTitleFieldFocused = (status: boolean) => {
    setIsTitleFieldFocused(status);
  };

  const handleToggleAllTodos = async () => {
    const updatedTodos = [...todos];
    const newStatus = { completed: false };

    if (!isAllTodosCompleted) {
      newStatus.completed = true;
    }

    const todosToRequest = !isAllTodosCompleted
      ? updatedTodos.filter(todo => !todo.completed)
      : updatedTodos;

    try {
      setError('');
      setTempTodos(todos);

      await Promise.all(todosToRequest.map(async (todo) => {
        const updatedTodo = await updateTodo(todo.id, newStatus) as Todo;
        const indexOfUpdatedTodo = updatedTodos
          .findIndex(({ id }) => id === updatedTodo.id);

        updatedTodos[indexOfUpdatedTodo].completed = updatedTodo.completed;
        setTodos(updatedTodos);
      }));
    } catch (err) {
      setError('Unable to update a todo');
    } finally {
      setTempTodos([]);
    }
  };

  const handleAddTodo = async (title: string): Promise<boolean | undefined> => {
    if (!title) {
      setError('Title should not be empty');

      return false;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    try {
      setError('');
      setTempTodos([newTodo]);
      const addedTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos].concat(addedTodo));

      return true;
    } catch (e) {
      setError('Unable to add a todo');

      return false;
    } finally {
      setTempTodos([]);
    }
  };

  const handleUpdateTodo = async (todo: Todo) => {
    try {
      setError('');
      setTempTodos([todo]);
      const newTodo = {
        title: todo.title,
        completed: todo.completed,
      };
      const updatedTodoResponse = await updateTodo(todo.id, newTodo);
      const updatedTodo = updatedTodoResponse as Todo;
      const preperedUpdatedTodo = {
        id: updatedTodo.id,
        userId: updatedTodo.userId,
        title: updatedTodo.title,
        completed: updatedTodo.completed,
      };
      const indexOfUpdatedTodo = todos.findIndex(item => item.id === todo.id);
      const newTodos = [...todos];

      newTodos[indexOfUpdatedTodo] = preperedUpdatedTodo;

      setTodos(newTodos);

      return true;
    } catch (e) {
      setError('Unable to update a todo');

      return false;
    } finally {
      setTempTodos([]);
    }
  };

  const handleDeleteTodo = async (todo: Todo) => {
    try {
      setError('');
      setTempTodos([todo]);
      await deleteTodo(todo.id);
      setTodos(prevTodos => prevTodos.filter(item => item.id !== todo.id));
    } catch (e) {
      setError('Unable to delete a todo');
    } finally {
      setTempTodos([]);
    }
  };

  const value = {
    todos,
    setTodos,
    error,
    setError,
    filter,
    setFilter,
    filteredTodos,
    USER_ID,
    loadTodos,
    tempTodos,
    setTempTodos,
    isAllTodosCompleted,
    isTitleFieldFocused,
    handlerTitleFieldFocused,
    handleToggleAllTodos,
    handleAddTodo,
    handleUpdateTodo,
    handleDeleteTodo,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  return useContext(TodosContext);
};
