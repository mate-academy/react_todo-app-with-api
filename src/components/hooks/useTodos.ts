import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/ErrorType';
import { fetchTodos } from '../../utils/fetchTodos';
import { FilterType } from '../../types/FilterType';
import { getFilteredTodos } from '../../utils/getFilteredTodo';
import { todosService } from '../../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.DEFAULT,
  );
  const [loadingTodosIds, setLoadingTodosIds] = useState<number[]>([]);
  const [filter, setFilter] = useState(FilterType.all);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );
  const completedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const handleRemoveError = useCallback(() => {
    setErrorMessage(ErrorType.DEFAULT);
  }, []);

  const handleErrorMessage = useCallback(
    (error: ErrorType) => {
      setErrorMessage(error);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handleRemoveError();
        timeoutRef.current = null;
      }, 3000);
    },
    [handleRemoveError],
  );

  const handleFilterChange = useCallback(
    (filterBy: FilterType) => {
      setFilter(filterBy);
    },
    [setFilter],
  );

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filter),
    [todos, filter],
  );

  const deleteTodo = (todoId: number) => {
    setLoadingTodosIds(current => [...current, todoId]);

    return todosService
      .delete(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        handleErrorMessage(ErrorType.DELETE);
      })
      .finally(() => {
        setLoadingTodosIds(current => current.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    fetchTodos(setTodos, handleErrorMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTodo = (todoToUpdate: Todo) => {
    setLoadingTodosIds(current => [...current, todoToUpdate.id]);

    return todosService
      .update(todoToUpdate)
      .then(updatedTodo => {
        setTodos(current =>
          current.map(todo => {
            return updatedTodo.id === todo.id ? updatedTodo : todo;
          }),
        );
      })
      .catch(error => {
        handleErrorMessage(ErrorType.UPDATE);
        throw error;
      })
      .finally(() => {
        setLoadingTodosIds(current =>
          current.filter(id => id !== todoToUpdate.id),
        );
      });
  };

  const toggleCompleted = (todo: Todo) => {
    const updatedTodo: Todo = {
      ...todo,
      completed: !todo.completed,
    };

    updateTodo(updatedTodo);
  };

  const bulkToggleCompleted = () => {
    if (activeTodos.length > 0) {
      activeTodos.forEach(todo => toggleCompleted(todo));
    } else {
      completedTodos.forEach(todo => toggleCompleted(todo));
    }
  };

  return {
    todos,
    errorMessage,
    loadingTodosIds,
    filteredTodos,
    filter,
    setTodos,
    deleteTodo,
    updateTodo,
    toggleCompleted,
    bulkToggleCompleted,
    handleErrorMessage,
    handleRemoveError,
    handleFilterChange,
  } as const;
};
