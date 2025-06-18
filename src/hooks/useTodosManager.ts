import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessages, TodoStatus } from '../constants';
import {
  getActiveTodosCount,
  getAllCompleted,
  getCompletedTodosCount,
  getFilteredTodos,
} from '../utils/todoUtils';
import { useFocus } from './useFocus';

export const useTodosManager = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filter, setFilter] = useState<TodoStatus>(TodoStatus.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const [newTodoTitle, setNewTodoTitle] = useState('');

  const { inputRef, setShouldFocus } = useFocus();

  const activeError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const handleAddTodo = useCallback(() => {
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      activeError(ErrorMessages.EMPTY_TITLE);
      setShouldFocus(true);
      setTempTodo(null);

      return;
    }

    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingIds(prev => [...prev, newTempTodo.id]);

    addTodo(trimmedTitle)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        activeError(ErrorMessages.ADD_TODO);
        setTempTodo(null);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== newTempTodo.id));
        setShouldFocus(true);
      });
  }, [activeError, setShouldFocus, newTodoTitle]);

  const handleToggleTodo = useCallback(
    (todoId: number) => {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        return;
      }

      setLoadingIds(prev => [...prev, todoId]);

      updateTodo(todoId, { completed: !todoToUpdate.completed })
        .then(updatedTodo => {
          setTodos(prev =>
            prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
          );
        })
        .catch(() => {
          activeError(ErrorMessages.UPDATE_TODO);
        })
        .finally(() => {
          setLoadingIds(prev => prev.filter(id => id !== todoId));
        });
    },
    [todos, activeError, setLoadingIds, setTodos],
  );

  const handleDeleteTodo = useCallback(
    (todoId: number, onSuccess?: () => void, onFailure?: () => void) => {
      setLoadingIds(prev => [...prev, todoId]);

      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
          onSuccess?.();
        })
        .catch(() => {
          activeError(ErrorMessages.DELETE_TODO);
          setShouldFocus(true);
          onFailure?.();
        })
        .finally(() => {
          setLoadingIds(prev => prev.filter(id => id !== todoId));
          setShouldFocus(true);
        });
    },
    [activeError, setLoadingIds, setTodos, setShouldFocus],
  );

  const handleClearCompleted = useCallback(() => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setErrorMessage('');
    setLoadingIds(prev => [...prev, ...completedTodos.map(todo => todo.id)]);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const failedIds: number[] = [];

        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            failedIds.push(completedTodos[index].id);
          }
        });

        setTodos(prevTodos =>
          prevTodos.filter(
            todo => !todo.completed || failedIds.includes(todo.id),
          ),
        );

        if (failedIds.length > 0) {
          activeError(ErrorMessages.DELETE_TODO);
          setShouldFocus(true);
        }
      })
      .finally(() => {
        setLoadingIds(prev =>
          prev.filter(id => !completedTodos.some(todo => todo.id === id)),
        );

        setShouldFocus(true);
      });
  }, [todos, activeError, setLoadingIds, setTodos, setShouldFocus]);

  const allCompleted = useMemo(() => getAllCompleted(todos), [todos]);

  const handleToggleAll = useCallback(() => {
    if (todos.length === 0) {
      return;
    }

    const shouldCompleteAll = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingIds(prev => [...prev, ...todosToUpdate.map(todo => todo.id)]);

    const updatePromises = todosToUpdate.map(todo =>
      updateTodo(todo.id, { completed: shouldCompleteAll }),
    );

    Promise.all(updatePromises)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo => {
            if (todosToUpdate.some(t => t.id === todo.id)) {
              return { ...todo, completed: shouldCompleteAll };
            }

            return todo;
          }),
        );
      })
      .catch(() => {
        activeError(ErrorMessages.UPDATE_TODO);
      })
      .finally(() => {
        setLoadingIds(prev =>
          prev.filter(id => !todosToUpdate.some(t => t.id === id)),
        );
        setShouldFocus(true);
      });
  }, [todos, allCompleted, activeError, setShouldFocus]);

  const handleUpdateTodoTitle = useCallback(
    (
      todoId: number,
      newTitle: string,
      onSuccess?: () => void,
      onFailure?: () => void,
    ) => {
      const trimmedTitle = newTitle.trim();

      if (trimmedTitle === '') {
        setLoadingIds(prev => [...prev, todoId]);
        deleteTodo(todoId)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
            onSuccess?.();
          })
          .catch(() => {
            activeError(ErrorMessages.DELETE_TODO);
            setShouldFocus(true);
            onFailure?.();
          })
          .finally(() => {
            setLoadingIds(prev => prev.filter(id => id !== todoId));
            setShouldFocus(true);
          });

        return;
      }

      setLoadingIds(prev => [...prev, todoId]);

      updateTodo(todoId, { title: trimmedTitle })
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
          );
          onSuccess?.();
        })
        .catch(() => {
          activeError(ErrorMessages.UPDATE_TODO);
          onFailure?.();
        })
        .finally(() => {
          setLoadingIds(prev => prev.filter(id => id !== todoId));
          setShouldFocus(true);
        });
    },
    [activeError, setShouldFocus],
  );

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');
    setLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => activeError(ErrorMessages.LOAD_TODOS))
      .finally(() => {
        setLoading(false);
        setShouldFocus(true);
      });
  }, [activeError, setShouldFocus]);

  const filteredTodos = useMemo(
    () => getFilteredTodos(todos, filter),
    [todos, filter],
  );

  const activeTodosCount = useMemo(() => getActiveTodosCount(todos), [todos]);

  const completedTodosCount = useMemo(
    () => getCompletedTodosCount(todos),
    [todos],
  );

  return {
    todos,
    loading,
    errorMessage,
    filter,
    tempTodo,
    loadingIds,
    allCompleted,
    activeTodosCount,
    completedTodosCount,
    filteredTodos,
    inputRef,
    setFilter,
    setErrorMessage,
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleAll,
    handleUpdateTodoTitle,
    setShouldFocus,
    newTodoTitle,
    setNewTodoTitle,
  };
};
