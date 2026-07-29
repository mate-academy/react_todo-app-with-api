import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import {
  getTodos,
  postTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from '../api/todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completedTodosCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const isEveryCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        case 'all':
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const onUpdateTodo = useCallback((todoToUpdate: Todo): Promise<Todo> => {
    setErrorMessage('');
    setLoadingTodoIds(prev => [...prev, todoToUpdate.id]);

    return updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );

        return updatedTodo;
      })
      .catch(error => {
        setErrorMessage('Unable to update a todo');
        throw error;
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoToUpdate.id));
      });
  }, []);

  const toggleTodo = useCallback(
    (todoToUpdate: Todo) => {
      return onUpdateTodo({
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      });
    },
    [onUpdateTodo],
  );

  const onDelete = useCallback((todoId: number) => {
    setLoadingTodoIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId));
      });
  }, []);

  const toggleAll = useCallback(() => {
    setErrorMessage('');

    const targetStatus = !isEveryCompleted;
    const newTodos = todos.filter(todo => todo.completed !== targetStatus);

    if (newTodos.length === 0) {
      return;
    }

    const idsToUpdate = newTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...idsToUpdate]);

    const updatedTodos = newTodos.map(todo =>
      updateTodo({ ...todo, completed: targetStatus }),
    );

    Promise.allSettled(updatedTodos)
      .then(results => {
        const updatedTodosMap = new Map<number, Todo>();
        let hasError = false;

        results.forEach(res => {
          if (res.status === 'fulfilled') {
            updatedTodosMap.set(res.value.id, res.value);
          } else {
            hasError = true;
          }
        });

        setTodos(prevTodos =>
          prevTodos.map(todo => updatedTodosMap.get(todo.id) || todo),
        );

        if (hasError) {
          setErrorMessage('Unable to update a todo');
        }
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
      });
  }, [todos, isEveryCompleted]);

  const handleAddTodo = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedTitle = title.trim();

      if (!trimmedTitle) {
        setErrorMessage('Title should not be empty');

        return;
      }

      setErrorMessage('');
      setIsSubmitting(true);

      setTempTodo({
        id: 0,
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      postTodo(trimmedTitle)
        .then(newTodo => {
          setTitle('');
          setTodos(prev => [...prev, newTodo]);
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setIsSubmitting(false);

          setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        });
    },
    [title],
  );

  const clearCompleted = useCallback(() => {
    setErrorMessage('');

    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingTodoIds(prev => [...prev, ...completedIds]);
    const deletePromise = completedIds.map(id => deleteTodo(id));

    Promise.allSettled(deletePromise)
      .then(results => {
        const successfulIds: number[] = [];
        let hasError = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successfulIds.push(completedIds[index]);
          } else {
            hasError = true;
          }
        });

        setTodos(prevTodos =>
          prevTodos.filter(todo => !successfulIds.includes(todo.id)),
        );

        if (hasError) {
          setErrorMessage('Unable to delete a todo');
        }
      })
      .finally(() => {
        setLoadingTodoIds(prev =>
          prev.filter(id => !completedIds.includes(id)),
        );

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  }, [todos]);

  return {
    todos,
    visibleTodos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
    title,
    setTitle,
    activeTodosCount,
    isEveryCompleted,
    isSubmitting,
    tempTodo,
    loadingTodoIds,
    inputRef,
    handleAddTodo,
    onDelete,
    clearCompleted,
    toggleTodo,
    completedTodosCount,
    toggleAll,
    onUpdateTodo,
  };
};
