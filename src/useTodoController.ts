import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ErrorMessage, FilterStatus, Todo } from './types/Todo';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { filterTodo, normalizeTodosLoading } from './utils/helpers';

export const useTodoController = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.DEFAULT,
  );
  const [filterStatus, setFilterStatus] = useState(FilterStatus.DEFAULT);
  const isFocusAddForm = useRef(true);

  const filteredTodos = useMemo(() => {
    return filterTodo(todos, filterStatus);
  }, [todos, filterStatus]);

  const setErrorDefault = () => {
    setErrorMessage(ErrorMessage.DEFAULT);
  };

  const initialFetch = () => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.TODO_LOAD);
      });
  };

  const handleAddTodo = (query: string): Promise<void> => {
    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
      loading: true,
    };

    setTempTodo(newTodo);

    return addTodo(newTodo)
      .then(newTodoFS => {
        setTodos([...todos, newTodoFS]);
      })
      .finally(() => {
        setTempTodo(null);
        isFocusAddForm.current = true;
      });
  };

  const handleUpdateTodo = useCallback(
    (updatedTodo: Todo): Promise<void> => {
      const todoToUpdate = todos.find(todo => todo.id === updatedTodo.id);

      if (todoToUpdate?.loading) {
        return Promise.resolve();
      }

      const getUpdateTodosWithLoading = (prevTodos: Todo[]) =>
        prevTodos.map(todo =>
          todo.id === updatedTodo.id ? { ...todo, loading: true } : todo,
        );

      setTodos(getUpdateTodosWithLoading);

      return updateTodo(updatedTodo)
        .then(updatedTodoFS => {
          const getUpdatedTodos = (prevTodos: Todo[]) =>
            prevTodos.map(todo =>
              todo.id === updatedTodoFS.id ? updatedTodo : todo,
            );

          setTodos(getUpdatedTodos);
        })
        .catch(error => {
          setErrorMessage(ErrorMessage.TODO_UPDATE);
          throw new Error(error);
        })
        .finally(() => setTodos(prevTodos => normalizeTodosLoading(prevTodos)));
    },
    [todos],
  );

  const handleCheckAll = () => {
    const completeAll = todos.some(todo => !todo.completed);
    const todosToToggle = todos
      .filter(todo => todo.completed !== completeAll)
      .map(todo => ({ ...todo, completed: !todo.completed }));

    todosToToggle.forEach(todo => {
      handleUpdateTodo(todo);
    });
  };

  const handleOnDelete = useCallback(
    (todoId: number) => {
      const todoToDelete = todos.find(todo => todo.id === todoId);

      if (todoToDelete?.loading) {
        return Promise.resolve();
      }

      const getLoadingTodosToDelete = (prevTodos: Todo[]) => {
        return prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, loading: true } : todo,
        );
      };

      setTodos(getLoadingTodosToDelete);

      return deleteTodo(todoId)
        .then(() => {
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
        })
        .catch(error => {
          setErrorMessage(ErrorMessage.TODO_DELETE);
          throw new Error(error);
        })
        .finally(() => {
          setTodos(prevTodos => normalizeTodosLoading(prevTodos));
          isFocusAddForm.current = true;
        });
    },
    [todos],
  );

  const handleClearAllCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleOnDelete(todo.id);
    });
  };

  useEffect(() => {
    if (isFocusAddForm.current) {
      isFocusAddForm.current = false;
    }
  });

  useEffect(() => {
    initialFetch();
  }, []);

  return {
    setFilterStatus,
    handleCheckAll,
    handleAddTodo,
    setErrorDefault,
    handleOnDelete,
    handleUpdateTodo,
    handleClearAllCompleted,
    setErrorMessage,
    errorMessage,
    filterStatus,
    isFocusAddForm,
    filteredTodos,
    tempTodo,
    todos,
  };
};
