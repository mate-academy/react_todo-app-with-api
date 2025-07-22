import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import * as todoService from '../api/todos';
import { FilterParams, TodoErrorMessage } from '../types/enums';
import {
  activeTodosCount,
  filterTodosByParam,
  isAllTodosCompleted,
} from '../utils/functions';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(TodoErrorMessage.DEFAULT);
  const [selectedFilterParam, setSelectedFilterParam] = useState<FilterParams>(
    FilterParams.All,
  );
  const [pendingTodoIds, setPendingTodoIds] = useState<Set<number>>(new Set());
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    setIsLoading(true);
    todoService
      .getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(TodoErrorMessage.UNABLE_TO_LOAD);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
    setIsLoading(true);
    const tempId = 0;
    const tempTodoItem: Todo = {
      id: tempId,
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tempTodoItem);

    todoService
      .createTodos({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(TodoErrorMessage.UNABLE_TO_ADD);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
        inputRef.current?.focus();
      });
  };

  const updateTodo = (
    updatedTodo: Todo,
    onSuccess?: () => void,
    onError?: () => void,
  ) => {
    setPendingTodoIds(prev => new Set(prev).add(updatedTodo.id));

    todoService
      .updateTodos(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(t => t.id === updatedTodo.id);

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
        onSuccess?.();
      })
      .catch(() => {
        setErrorMessage(TodoErrorMessage.UNABLE_TO_UPDATE);
        onError?.();
      })
      .finally(() => {
        setPendingTodoIds(prev => {
          const updated = new Set(prev);

          updated.delete(updatedTodo.id);

          return updated;
        });
        inputRef.current?.focus();
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(TodoErrorMessage.EMPTY_TiTLE);
      inputRef.current?.focus();
      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    });
  };

  const deleteTodo = (todoId: number) => {
    setPendingTodoIds(prev => new Set(prev).add(todoId));
    todoService
      .deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(TodoErrorMessage.UNABLE_TO_DELETE);
      })
      .finally(() => {
        setIsLoading(false);
        setPendingTodoIds(prev => {
          const updated = new Set(prev);

          updated.delete(todoId);

          return updated;
        });
        inputRef.current?.focus();
      });
  };

  const handleDelete = (todoId: number) => {
    deleteTodo(todoId);
  };

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const loadingSet = new Set(pendingTodoIds);

    completedTodos.forEach(todo => loadingSet.add(todo.id));
    setPendingTodoIds(loadingSet);

    const deletePromises = completedTodos.map(todo =>
      todoService
        .deleteTodos(todo.id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(todoItem => todoItem.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorMessage(TodoErrorMessage.UNABLE_TO_DELETE);
        })
        .finally(() => {
          setPendingTodoIds(prev => {
            const updated = new Set(prev);

            updated.delete(todo.id);

            return updated;
          });
        }),
    );

    Promise.allSettled(deletePromises).then(() => {
      inputRef.current?.focus();
    });
  };

  const handleChangeFilterParam = useCallback((filterParam: FilterParams) => {
    setSelectedFilterParam(filterParam);
  }, []);

  const isAllCompleted = useMemo(
    () => (isLoading ? false : isAllTodosCompleted(todos)),
    [isLoading, todos],
  );

  const toggleAllTodos = () => {
    const shouldCompleteAll = !isAllCompleted;
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const updatePromises = todosToUpdate.map(todo =>
      todoService
        .updateTodos({ ...todo, completed: shouldCompleteAll })
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
          );
        })
        .catch(() => {
          setErrorMessage(TodoErrorMessage.UNABLE_TO_UPDATE);
        }),
    );

    Promise.allSettled(updatePromises).then(() => {
      inputRef.current?.focus();
    });
  };

  const filteredTodos = useMemo(
    () => filterTodosByParam(todos, selectedFilterParam),
    [todos, selectedFilterParam],
  );
  const shouldShowTodoList = useMemo(
    () => todos.length > 0 || isLoading,
    [todos, isLoading],
  );
  const isTodoListNotEmpty = useMemo(() => todos.length > 0, [todos]);
  const numberOfActiveTodos = useMemo(() => activeTodosCount(todos), [todos]);
  const hasCompletedTodo = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );
  const clearMessage = useCallback(() => {
    setErrorMessage(TodoErrorMessage.DEFAULT);
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setErrorMessage(TodoErrorMessage.DEFAULT);
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [errorMessage]);

  return {
    isAllCompleted,
    handleSubmit,
    setNewTodoTitle,
    newTodoTitle,
    isLoading,
    inputRef,
    toggleAllTodos,
    isTodoListNotEmpty,
    shouldShowTodoList,
    filteredTodos,
    tempTodo,
    handleDelete,
    pendingTodoIds,
    updateTodo,
    numberOfActiveTodos,
    selectedFilterParam,
    handleChangeFilterParam,
    clearCompletedTodos,
    hasCompletedTodo,
    errorMessage,
    clearMessage,
  };
}
