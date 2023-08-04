/* eslint-disable max-len */
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { SORT } from '../types/Sort';
import { client } from '../utils/fetchClient';
import { TodoError } from '../types/TodoError';

type Props = {
  children: React.ReactNode;
};

interface TodoContextType {
  title: string;
  todos: Todo[];
  tempTodo: Todo | null;
  loading: number[];
  currentFilter: SORT;
  setCurrentFilter: React.Dispatch<React.SetStateAction<SORT>>;
  errorMessage: TodoError;
  setErrorMessage: React.Dispatch<React.SetStateAction<TodoError>>;
  addNewTitle: (str: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleDeleteTodo: (todoId: number) => void;
  handleToggleTodo: (todoId: number) => void;
  handleToggleTodos: () => void;
  handleDeleteCompletedTodos: () => void;
  handleRename: (newTitle: string, todoId: number) => void;
  itemsLeft: number;
  itemsCompleted: number;
}

export const TodoContext = createContext<TodoContextType>({
  title: '',
  todos: [],
  tempTodo: null,
  loading: [],
  currentFilter: SORT.ALL,
  setCurrentFilter: () => {},
  errorMessage: TodoError.empty,
  setErrorMessage: () => {},
  addNewTitle: () => {},
  handleSubmit: () => {},
  handleDeleteTodo: () => {},
  handleToggleTodo: () => {},
  handleToggleTodos: () => {},
  handleDeleteCompletedTodos: () => {},
  handleRename: () => {},
  itemsLeft: 0,
  itemsCompleted: 0,
});

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<number[]>([]);
  const [currentFilter, setCurrentFilter] = useState<SORT>(SORT.ALL);
  const [errorMessage, setErrorMessage] = useState(TodoError.empty);

  const USER_ID = 11238;

  const fetchTodosFromServer = async () => {
    try {
      const todosFromServer = await client.get<Todo[]>('/todos');
      const filteredTodos = todosFromServer.filter(
        (todo) => todo.userId === USER_ID,
      );

      setTodos(filteredTodos);
    } catch {
      setErrorMessage(TodoError.load);
    }
  };

  useEffect(() => {
    fetchTodosFromServer();
  }, []);

  const addNewTitle = (str: string) => {
    setTitle(str);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (title.trim() === '') {
        setErrorMessage(TodoError.emptyTodo);
        setTitle('');

        return;
      }

      const newTodo = {
        userId: USER_ID,
        title,
        completed: false,
        id: 0,
      };

      setTempTodo(newTodo);
      setLoading([0]);

      try {
        const response = await client.post<Todo>('/todos', newTodo);

        setTodos((prevTodos) => [...prevTodos, response]);
      } catch {
        setErrorMessage(TodoError.add);
      } finally {
        setLoading([]);
        setTempTodo(null);
        setTitle('');
      }
    },
    [title],
  );

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setLoading([todoId]);

    try {
      await client.delete(`/todos/${todoId}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      setErrorMessage(TodoError.empty);
    } catch {
      setErrorMessage(TodoError.delete);
    } finally {
      setLoading([]);
    }
  }, []);

  const handleToggleTodo = useCallback(
    async (todoId: number) => {
      setLoading([todoId]);

      try {
        const currentTodo = todos.find((todo) => todo.id === todoId);
        const newCompletedStatus = !currentTodo?.completed;

        await client.patch(`/todos/${todoId}`, {
          completed: newCompletedStatus,
        });
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === todoId
          ? { ...todo, completed: newCompletedStatus }
          : todo)));
        setErrorMessage(TodoError.empty);
      } catch {
        setErrorMessage(TodoError.update);
      } finally {
        setLoading([]);
      }
    },
    [todos],
  );

  const completedTodos = todos.filter((todo) => todo.completed);
  const notCompletedTodos = todos.filter((todo) => !todo.completed);

  const handleToggleTodos = useCallback(async () => {
    let todoIds = notCompletedTodos.map((todo) => todo.id);
    const allTodosCompleted = todos.every((todo) => todo.completed);

    if (allTodosCompleted) {
      todoIds = completedTodos.map((todo) => todo.id);
    }

    setLoading(todoIds);
    try {
      const updatedTodos = todos.map((todo) => ({
        ...todo,
        completed: !allTodosCompleted,
      }));

      await Promise.all(
        updatedTodos.map((todo) => client.patch(`/todos/${todo.id}`, { completed: todo.completed })),
      );

      setTodos(updatedTodos);
      setErrorMessage(TodoError.empty);
    } catch {
      setErrorMessage(TodoError.update);
    } finally {
      setLoading([]);
    }
  }, [todos]);

  const handleDeleteCompletedTodos = useCallback(async () => {
    const todoIds = completedTodos.map((todo) => todo.id);

    setLoading(todoIds);

    try {
      await Promise.all(
        todoIds.map((todoId) => client.delete(`/todos/${todoId}`)),
      );
      setTodos(notCompletedTodos);
      setErrorMessage(TodoError.empty);
    } catch {
      setErrorMessage(TodoError.update);
    } finally {
      setLoading([]);
    }
  }, [todos]);

  const handleRename = useCallback(async (newTitle: string, todoId: number) => {
    setLoading([todoId]);

    try {
      if (newTitle.trim() !== '') {
        await client.patch(`/todos/${todoId}`, { title: newTitle });
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === todoId ? { ...todo, title: newTitle } : todo)));
      }

      setErrorMessage(TodoError.empty);
    } catch {
      setErrorMessage(TodoError.update);
    } finally {
      setLoading([]);
    }
  }, []);

  const itemsLeft = useMemo(
    () => todos.filter((todo) => todo.completed === false).length,
    [todos],
  );
  const itemsCompleted = useMemo(
    () => todos.filter((todo) => todo.completed === true).length,
    [todos],
  );

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (!todo.completed && currentFilter === SORT.COMPLETED) {
        return false;
      }

      if (todo.completed && currentFilter === SORT.ACTIVE) {
        return false;
      }

      return true;
    });
  }, [todos, currentFilter]);

  const value = {
    title,
    todos: visibleTodos,
    tempTodo,
    loading,
    currentFilter,
    setCurrentFilter,
    errorMessage,
    setErrorMessage,
    addNewTitle,
    handleSubmit,
    handleDeleteTodo,
    handleToggleTodo,
    handleToggleTodos,
    handleDeleteCompletedTodos,
    handleRename,
    itemsLeft,
    itemsCompleted,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
