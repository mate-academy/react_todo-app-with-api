import {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  addTodo,
  getTodos,
  removeTodo,
  updateTodo,
} from '../api/todos';

import { FilterType } from '../types/FilterType';
import { ErrorType } from '../types/ErrorType';
import { Todo } from '../components/TodoItem/Todo';
import { getFilteredTodos } from '../helpers/helpers';

const USER_ID = 6748;

export const useApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.ALL);
  const [error, setError] = useState<ErrorType>(ErrorType.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [unableField, setUnableField] = useState(false);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  const showError = (errorType: ErrorType) => {
    setError(errorType);
    setTimeout(() => setError(ErrorType.NONE), 3000);
  };

  const handleCloseError = useCallback(() => {
    setError(ErrorType.NONE);
  }, []);

  const activeTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      showError(ErrorType.LOAD);
      setTodos([]);
    }
  }, []);

  const addNewTodo = useCallback(
    async (title: string) => {
      if (!title.trim()) {
        showError(ErrorType.TITLE);

        return;
      }

      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      try {
        setUnableField(true);
        setTempTodo({
          id: 0,
          ...newTodo,
        });

        const todo = await addTodo(newTodo);

        setTodos(prevTodos => [...prevTodos, todo]);
      } catch {
        showError(ErrorType.ADD);
      } finally {
        setUnableField(false);
        setTempTodo(null);
      }
    }, [],
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      try {
        setLoadingTodos(prevTodos => [...prevTodos, id]);

        await removeTodo(id);
        fetchTodos();
      } catch {
        showError(ErrorType.DELETE);
      } finally {
        setLoadingTodos([0]);
      }
    }, [],
  );

  const handleDeleteCompleted = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return getFilteredTodos(todos, filterType);
  }, [filterType, todos]);

  const updateTodoStatus = useCallback(
    async (
      id: number,
      completed: Partial<Todo>,
    ) => {
      try {
        setLoadingTodos(prevTodos => [...prevTodos, id]);

        await updateTodo(id, completed);

        setTodos(prevTodos => {
          return prevTodos.map((todo) => {
            if (todo.id === id) {
              return {
                ...todo,
                completed: !completed,
              };
            }

            return todo;
          });
        });

        fetchTodos();
      } catch {
        showError(ErrorType.UPDATE);
      } finally {
        setLoadingTodos([0]);
      }
    }, [],
  );

  const updateAllStatus = useCallback(() => {
    activeTodos.forEach(todo => {
      updateTodoStatus(todo.id, { completed: true });
    });

    if (!activeTodos.length) {
      completedTodos.forEach(todo => {
        updateTodoStatus(todo.id, { completed: false });
      });
    }
  }, [activeTodos, completedTodos]);

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    error,
    tempTodo,
    filterType,
    addNewTodo,
    deleteTodo,
    unableField,
    activeTodos,
    visibleTodos,
    loadingTodos,
    setFilterType,
    completedTodos,
    updateAllStatus,
    handleCloseError,
    updateTodoStatus,
    handleDeleteCompleted,
  };
};
