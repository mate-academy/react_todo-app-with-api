import { useEffect, useMemo, useState } from 'react';
import {
  createTodo,
  deleteTodo as removeTodo,
  getTodos,
  updateTodo as patchTodo,
  USER_ID,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

const ERROR_TIMEOUT = 3000;

function filterTodos(todos: Todo[], filter: Filter) {
  switch (filter) {
    case Filter.Active:
      return todos.filter(({ completed }) => !completed);
    case Filter.Completed:
      return todos.filter(({ completed }) => completed);
    default:
      return todos;
  }
}

export function useApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timerId = setTimeout(() => setErrorMessage(''), ERROR_TIMEOUT);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const visibleTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const activeCount = todos.filter(({ completed }) => !completed).length;

  const addTodo = async (title: string): Promise<boolean> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return false;
    }

    setErrorMessage('');

    const newTodo = { userId: USER_ID, title: trimmedTitle, completed: false };

    setTempTodo({ id: 0, ...newTodo });

    try {
      const createdTodo = await createTodo(newTodo);

      setTodos(current => [...current, createdTodo]);

      return true;
    } catch {
      setErrorMessage('Unable to add a todo');

      return false;
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number): Promise<boolean> => {
    setErrorMessage('');
    setProcessingIds(current => [...current, todoId]);

    try {
      await removeTodo(todoId);
      setTodos(current => current.filter(({ id }) => id !== todoId));

      return true;
    } catch {
      setErrorMessage('Unable to delete a todo');

      return false;
    } finally {
      setProcessingIds(current => current.filter(id => id !== todoId));
    }
  };

  const clearCompleted = () => {
    todos
      .filter(({ completed }) => completed)
      .forEach(({ id }) => deleteTodo(id));
  };

  const updateTodo = async (
    todo: Todo,
    changes: Partial<Omit<Todo, 'id'>>,
  ): Promise<boolean> => {
    setErrorMessage('');
    setProcessingIds(current => [...current, todo.id]);

    try {
      const updatedTodo = await patchTodo(todo.id, changes);

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );

      return true;
    } catch {
      setErrorMessage('Unable to update a todo');

      return false;
    } finally {
      setProcessingIds(current => current.filter(id => id !== todo.id));
    }
  };

  const toggleTodo = (todo: Todo) => {
    return updateTodo(todo, { completed: !todo.completed });
  };

  const renameTodo = (todo: Todo, title: string) => {
    return updateTodo(todo, { title });
  };

  const toggleAll = () => {
    const newStatus = !(todos.length > 0 && activeCount === 0);

    todos
      .filter(({ completed }) => completed !== newStatus)
      .forEach(todo => updateTodo(todo, { completed: newStatus }));
  };

  return {
    visibleTodos,
    hasTodos: todos.length > 0,
    activeCount,
    hasCompleted: activeCount < todos.length,
    isAllCompleted: todos.length > 0 && activeCount === 0,
    filter,
    setFilter,
    errorMessage,
    clearError: () => setErrorMessage(''),
    tempTodo,
    processingIds,
    addTodo,
    deleteTodo,
    clearCompleted,
    todosCount: todos.length,
    toggleTodo,
    toggleAll,
    renameTodo,
  };
}
