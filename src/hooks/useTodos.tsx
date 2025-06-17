import { useEffect, useRef, useState } from 'react';
import { addTodo, deleteTodo, getTodos, patchTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodoToProcessing = (todoId: number) => {
    setProcessingTodoIds(current => [...current, todoId]);
  };

  const handleRemoveTodoToProcessing = (todoId: number) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodosFailed);
      });
  }, []);

  const handleDeleteTodo = async (todoId: number) => {
    handleAddTodoToProcessing(todoId);
    try {
      await deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage(ErrorMessage.DeleteTodoFailed);
      throw new Error('Delete failed');
    } finally {
      handleRemoveTodoToProcessing(todoId);
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id);
    });
  };

  const handleAddTodo = async ({
    userId,
    title,
    completed,
  }: Omit<Todo, 'id'>) => {
    setErrorMessage(null);

    const tempId = -Date.now();
    const tempTodo: Todo = { id: tempId, userId, title, completed };

    handleAddTodoToProcessing(tempId);
    setTodos(current => [...current, tempTodo]);

    try {
      const newTodo = await addTodo({ userId, title, completed });

      setTodos(current =>
        current.map(todo => (todo.id === tempId ? newTodo : todo)),
      );

      handleRemoveTodoToProcessing(tempId);
    } catch {
      setTodos(current => current.filter(todo => todo.id !== tempId));
      setErrorMessage(ErrorMessage.AddTodoFailed);
      handleRemoveTodoToProcessing(tempId);
      throw new Error('Addition failed');
    }
  };

  const handleToggleCompleted = async (todoId: number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    try {
      setProcessingTodoIds(prev => [...prev, todoId]);

      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
      };

      await patchTodo(updatedTodo);

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodoFailed);
    } finally {
      setProcessingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleToggleAllCompleted = async (shouldComplete: boolean) => {
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    try {
      await Promise.all(
        todosToUpdate.map(todo =>
          patchTodo({ ...todo, completed: shouldComplete }),
        ),
      );

      setTodos(prevTodos =>
        prevTodos.map(todo => ({
          ...todo,
          completed: shouldComplete,
        })),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodoFailed);
    }
  };

  const handleRenameTodo = async (todoId: number, newTitle: string) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    try {
      setProcessingTodoIds(prev => [...prev, todoId]);

      const updatedTodo = {
        ...todoToUpdate,
        title: newTitle,
      };

      await patchTodo(updatedTodo);

      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch {
      setErrorMessage(ErrorMessage.UpdateTodoFailed);
      throw new Error('Update failed');
    } finally {
      setProcessingTodoIds(prev => prev.filter(id => id !== todoId));
    }
  };

  return {
    todos,
    errorMessage,
    processingTodoIds,
    inputRef,
    setErrorMessage,
    handleDeleteTodo,
    handleClearCompleted,
    handleAddTodo,
    handleToggleCompleted,
    handleToggleAllCompleted,
    handleRenameTodo,
  };
};
