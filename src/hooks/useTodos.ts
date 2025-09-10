import { useState, useEffect, useRef } from 'react';
import { getTodos, addTodo, deleteTodo, updateTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/preferences';
import { ErrorMessage } from '../types/ErrorMessage';

export const useTodos = (showError: (msg: ErrorMessage) => void) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedIds, setProcessedIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load))
      .finally(() => {
        setIsLoading(false);
        newTodoField.current?.focus();
      });
  }, []);

  useEffect(() => {
    if (!isAdding) {
      newTodoField.current?.focus();
    }
  }, [isAdding]);

  const handleAddTodo = async () => {
    const trimmedTitle = inputValue.trim();

    if (!trimmedTitle) {
      return showError(ErrorMessage.Empty);
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setIsAdding(true);

    try {
      const created = await addTodo(trimmedTitle);

      setTodos(prev => [...prev, created]);
      setInputValue('');
    } catch {
      showError(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    setProcessedIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setProcessedIds(prev => prev.filter(id => id !== todoId));
      newTodoField.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    await Promise.all(
      completed.map(async todo => {
        try {
          await deleteTodo(todo.id);
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        } catch {
          showError(ErrorMessage.Delete);
        }
      }),
    );
    newTodoField.current?.focus();
  };

  const handleToggleTodo = async (todo: Todo) => {
    setProcessedIds(prev => [...prev, todo.id]);
    await new Promise(res => setTimeout(res, 0));
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      showError(ErrorMessage.Update);
    } finally {
      setProcessedIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const shouldComplete = todos.some(todo => !todo.completed);
    const toUpdate = todos.filter(todo => todo.completed !== shouldComplete);

    await Promise.all(
      toUpdate.map(async todo => {
        setProcessedIds(prev => [...prev, todo.id]);
        await new Promise(res => setTimeout(res, 0));
        try {
          const updated = await updateTodo(todo.id, {
            completed: shouldComplete,
          });

          setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
        } catch {
          showError(ErrorMessage.Update);
        } finally {
          setProcessedIds(prev => prev.filter(id => id !== todo.id));
        }
      }),
    );
  };

  return {
    todos,
    tempTodo,
    processedIds,
    setProcessedIds,
    isAdding,
    isLoading,
    newTodoField,
    setTodos,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleToggleTodo,
    handleToggleAll,
    inputValue,
    setInputValue,
  };
};
