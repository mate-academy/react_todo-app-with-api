import { useEffect, useRef, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';
import { Todo, TodoChanges } from '../types/Todo';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [value, setValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodos = todos.filter(todo => !todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const hasAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => setError(null), 3000);

    return () => clearTimeout(timerId);
  }, [error]);

  useEffect(() => {
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  const hideError = () => setError(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (tempTodo !== null) {
      return;
    }

    const title = value.trim();

    if (!title) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(newTodo);
    setError(null);
    createTodo(title)
      .then(response => {
        setTodos(prevTodos => [...prevTodos, response]);
        setValue('');
      })
      .catch(() => setError(ErrorMessage.AddTodo))
      .finally(() => setTempTodo(null));
  };

  const handleDelete = (id: number): Promise<void> => {
    if (processingIds.includes(id)) {
      return Promise.resolve();
    }

    setProcessingIds(prev => [...prev, id]);
    setError(null);

    return deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError(ErrorMessage.DeleteTodo);

        throw new Error(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setProcessingIds(prev =>
          prev.filter(processingId => processingId !== id),
        );

        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      completedTodos.map(todo => handleDelete(todo.id).catch(() => {})),
    );
  };

  const handleUpdate = (id: number, changes: TodoChanges) => {
    if (processingIds.includes(id)) {
      return Promise.resolve();
    }

    setProcessingIds(prev => [...prev, id]);
    setError(null);

    return updateTodo(id, changes)
      .then(response => {
        setTodos(prevTodos =>
          prevTodos.map(todo => (todo.id === id ? response : todo)),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo);
        throw new Error(ErrorMessage.UpdateTodo);
      })
      .finally(() =>
        setProcessingIds(prev =>
          prev.filter(processingId => processingId !== id),
        ),
      );
  };

  const handleToggleAll = async () => {
    const completed = !hasAllTodosCompleted;

    await Promise.all(
      todos
        .filter(todo => todo.completed !== completed)
        .map(todo => handleUpdate(todo.id, { completed }).catch(() => {})),
    );
  };

  return {
    todos,
    error,
    hideError,
    value,
    setValue,
    tempTodo,
    inputRef,
    processingIds,
    activeCount: activeTodos.length,
    hasCompletedTodos,
    hasAllTodosCompleted,
    handleSubmit,
    handleDelete,
    handleClearCompleted,
    handleUpdate,
    handleToggleAll,
  };
};
