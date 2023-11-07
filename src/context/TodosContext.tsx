import {
  createContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';
import { Tabs } from '../types/Tabs';
import { ErrorType } from '../types/ErrorType';
import { getTodos, removeTodo, updateTodo } from '../api/todos';

const USER_ID_TO_SET = 11826;

type DefaultValueType = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  selectedFilter: Tabs;
  setSelectedFilter: (tab: Tabs) => void;
  todosToDisplay: Todo[]
  error: ErrorType
  setError: (errro: ErrorType) => void;
  tempTodo: Todo | null,
  setTempTodo: (todo: Todo | null) => void,
  loadingTodos: number[],
  setLoadingTodos: React.Dispatch<React.SetStateAction<number[]>>
  handleToggleAll: () => void;
  toggleStatus: (todo: Todo) => void;
  handleTodoDelete: (todoID: number) => void;
  handleClearCompleted: () => void;
  USER_ID: number;
  inputRef: React.RefObject<HTMLInputElement> | null;
};

export const TodosContext = createContext<DefaultValueType>({
  todos: [],
  setTodos: () => {},
  selectedFilter: Tabs.All,
  setSelectedFilter: () => {},
  todosToDisplay: [],
  error: ErrorType.Success,
  setError: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  loadingTodos: [],
  setLoadingTodos: () => {},
  handleToggleAll: () => {},
  toggleStatus: () => {},
  handleTodoDelete: () => {},
  handleClearCompleted: () => {},
  USER_ID: USER_ID_TO_SET,
  inputRef: null,
});

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Tabs>(Tabs.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(ErrorType.Success);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const USER_ID = USER_ID_TO_SET;
  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    try {
      const loadedTodos = await getTodos(USER_ID_TO_SET);

      setTodos(loadedTodos);
    } catch {
      setError(ErrorType.Loading);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      setError(ErrorType.Success);
    }, 3000);

    return () => {
      clearTimeout(errorTimeout);
    };
  }, [error]);

  const todosToDisplay = todos.filter(todo => {
    switch (selectedFilter) {
      case Tabs.All:
        return todo;
      case Tabs.Active:
        return !todo.completed;
      case Tabs.Completed:
        return todo.completed;
      default:
        return todo;
    }
  });

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const handleClearCompleted = () => {
    completedTodos.forEach(async ({ id }) => {
      setLoadingTodos(prevLoading => [...prevLoading, id]);

      try {
        await removeTodo(id);

        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        inputRef?.current?.focus();
      } catch {
        setError(ErrorType.Delete);
      } finally {
        setLoadingTodos(prevLoading => (
          prevLoading.filter(todoId => todoId !== id)));
      }
    });
  };

  const handleToggleAll = () => {
    const isAllCompleted = todos.every(todo => todo.completed);

    let todosToUpdate = [...todos];

    if (!isAllCompleted) {
      todosToUpdate = [...todos].filter(todo => !todo.completed);
    }

    todosToUpdate.forEach(async ({ id }) => {
      setLoadingTodos(prevLoading => [...prevLoading, id]);

      try {
        const updatedTodo = await updateTodo(
          id, { completed: !isAllCompleted },
        );

        setTodos(prevTodos => prevTodos.map(todo => {
          return todo.id === id
            ? updatedTodo
            : todo;
        }));
      } catch {
        setError(ErrorType.Update);
      } finally {
        setLoadingTodos(prevLoading => (
          prevLoading.filter(todoId => todoId !== id)));
      }
    });
  };

  const toggleStatus = async (todo: Todo) => {
    setLoadingTodos([...loadingTodos, todo.id]);

    try {
      const updatedTodo = await updateTodo(
        // pass the entire object to the request because one
        // of the tests crashes when only the update information is passed
        todo.id, { ...todo, completed: !todo.completed },
      );

      const updatedTodos = todos.map(t => {
        return t.id === todo.id
          ? updatedTodo
          : t;
      });

      setTodos(updatedTodos);
    } catch {
      setError(ErrorType.Update);
    } finally {
      setLoadingTodos(loadingTodos.filter(id => id !== todo.id));
    }
  };

  const handleTodoDelete = async (todoID: number) => {
    setLoadingTodos([...loadingTodos, todoID]);

    try {
      await removeTodo(todoID);

      setTodos(prevTodos => prevTodos.filter(t => t.id !== todoID));
      inputRef?.current?.focus();
    } catch {
      setError(ErrorType.Delete);
    } finally {
      setLoadingTodos(loadingTodos.filter(id => id !== todoID));
    }
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        selectedFilter,
        setSelectedFilter,
        todosToDisplay,
        error,
        setError,
        tempTodo,
        setTempTodo,
        loadingTodos,
        setLoadingTodos,
        handleToggleAll,
        toggleStatus,
        handleTodoDelete,
        handleClearCompleted,
        USER_ID,
        inputRef,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
