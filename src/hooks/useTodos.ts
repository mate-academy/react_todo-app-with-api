import { useEffect, useMemo, useRef, useState } from 'react';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import {
  getTodos,
  removeTodo,
  sendTodo,
  updateTodo,
  USER_ID,
} from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.None,
  );
  const [status, setStatus] = useState<Status>(Status.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const focusedInput = useRef<HTMLInputElement>(null);
  const timerId = useRef(0);

  const handleSetError = (newError: ErrorMessage) => {
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setErrorMessage(ErrorMessage.None);
    }, 3000);

    setErrorMessage(newError);
  };

  useEffect(() => {
    setIsInputDisabled(true);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        handleSetError(ErrorMessage.Load);
      })
      .finally(() => {
        setIsInputDisabled(false);
        focusedInput.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (!isInputDisabled) {
      focusedInput.current?.focus();
    }
  }, [isInputDisabled]);

  const preperedTodos = useMemo(() => {
    return todos.filter(todo => {
      if (status === Status.Completed) {
        return todo.completed;
      }

      if (status === Status.Active) {
        return !todo.completed;
      } else {
        return todo;
      }
    });
  }, [todos, status]);

  const itemsLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const areAllTodosCompleted = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const isCompletedTodo = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const addTodo = () => {
    const preperedTitle = query.trim();

    if (preperedTitle.length === 0) {
      return handleSetError(ErrorMessage.Title);
    }

    setIsInputDisabled(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: preperedTitle,
      completed: false,
    } as Todo);

    sendTodo({ userId: USER_ID, title: preperedTitle, completed: false })
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setQuery('');
      })
      .catch(() => {
        handleSetError(ErrorMessage.AddTodo);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setTempTodo(null);
        focusedInput.current?.focus();
      });
  };

  const deleteTodo = (todoId: number, fromEditing = false): Promise<void> => {
    if (!fromEditing) {
      setIsInputDisabled(true);
    }

    setLoadingTodoIds((currentIds: number[]) => [...currentIds, todoId]);

    return removeTodo(todoId)
      .then(() => {
        setTodos(ids => ids.filter(todo => todo.id !== todoId));

        if (fromEditing) {
          focusedInput.current?.focus();
        }
      })
      .catch(error => {
        handleSetError(ErrorMessage.DeleteTodo);
        throw error;
      })
      .finally(() => {
        if (!fromEditing) {
          setIsInputDisabled(false);
        }

        setLoadingTodoIds(ids => ids.filter(id => id !== todoId));
      });
  };

  async function deleteAllCompleteTodos() {
    setIsInputDisabled(true);

    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingTodoIds(currentTodos => [...currentTodos, ...completedIds]);

    const result = await Promise.allSettled(
      completedIds.map(id => removeTodo(id)),
    );

    const successIds = result
      .map((r, i) => (r.status === 'fulfilled' ? completedIds[i] : null))
      .filter(ids => ids !== null);

    const hasError = result.some(todo => todo.status === 'rejected');

    if (hasError) {
      handleSetError(ErrorMessage.DeleteTodo);
    }

    setTodos(current => current.filter(todo => !successIds.includes(todo.id)));

    setLoadingTodoIds(current =>
      current.filter(ids => !successIds.includes(ids)),
    );

    setIsInputDisabled(false);
    focusedInput.current?.focus();
  }

  const changeStatusTodo = (todo: Todo) => {
    setIsInputDisabled(true);
    setLoadingTodoIds((currentIds: number[]) => [...currentIds, todo.id]);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        handleSetError(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setIsInputDisabled(false);
        setLoadingTodoIds(ids => ids.filter(id => id !== todo.id));
      });
  };

  async function toggleAllTodosComplete() {
    setIsInputDisabled(true);
    let filteredTodos = [...todos];

    if (!areAllTodosCompleted) {
      filteredTodos = [...todos].filter(todo => !todo.completed);
    }

    setLoadingTodoIds(currentTodos => [
      ...currentTodos,
      ...filteredTodos.map(todo => todo.id),
    ]);

    try {
      const result = await Promise.allSettled(
        filteredTodos.map(todo =>
          updateTodo(todo.id, { completed: !todo.completed }),
        ),
      );

      const updatedTodos: Todo[] = [];

      result.forEach(item => {
        if (item.status === 'fulfilled') {
          updatedTodos.push(item.value);
        }
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          const updated = updatedTodos.find(r => r.id === todo.id);

          return updated ?? todo;
        }),
      );

      if (result.some(item => item.status === 'rejected')) {
        handleSetError(ErrorMessage.UpdateTodo);
      }
    } finally {
      setIsInputDisabled(false);
      focusedInput.current?.focus();
      setLoadingTodoIds([]);
    }
  }

  const handleRename = (todoId: number, todoTitle: string) => {
    const preparedTitle = todoTitle.trim();

    setErrorMessage(ErrorMessage.None);

    if (!preparedTitle) {
      return deleteTodo(todoId, true);
    }

    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    return updateTodo(todoId, { title: preparedTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(error => {
        handleSetError(ErrorMessage.UpdateTodo);
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
      });
  };

  return {
    todos,
    preperedTodos,
    errorMessage,
    status,
    setStatus,
    query,
    setQuery,
    tempTodo,
    isInputDisabled,
    loadingTodoIds,
    focusedInput,
    itemsLeft,
    isCompletedTodo,
    handleSetError,
    addTodo,
    deleteTodo,
    deleteAllCompleteTodos,
    changeStatusTodo,
    toggleAllTodosComplete,
    handleRename,
    areAllTodosCompleted,
  };
};
