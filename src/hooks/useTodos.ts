import { useState, useEffect } from 'react';
import {
  getTodos,
  addTodo,
  deleteTodo,
  completeTodo,
  updateTodoTitle,
} from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/ErrorMessage';

export const useTodos = (onError: (message: string) => void) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [completingIds, setCompletingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingIds, setEditingIds] = useState<number[]>([]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        onError(ErrorMessage.LOAD_TODOS);
      });
  }, [onError]);

  const handleAddTodo = async (title: string, userId: number) => {
    setIsAdding(true);
    const tempTodoo: Todo = {
      id: 0,
      userId,
      title,
      completed: false,
    };

    setTempTodo(tempTodoo);

    try {
      const newTodo = await addTodo(title);

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);

      return newTodo;
    } catch (error) {
      setTempTodo(null);
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setDeletingIds(prev => Array.from(new Set([...prev, id])));
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      throw error;
    } finally {
      setDeletingIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setDeletingIds(completedTodos.map(todo => todo.id));
    setIsClearing(true);

    const deletePromises = completedTodos.map(todo =>
      deleteTodo(todo.id)
        .then(() => ({ id: todo.id, success: true }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    try {
      const results = await Promise.all(deletePromises);

      const successfulIds = results
        .filter(result => result.success)
        .map(result => result.id);

      const hasError = results.some(result => !result.success);

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      if (hasError) {
        throw new Error('Unable to delete a todo');
      }
    } finally {
      setDeletingIds([]);
      setIsClearing(false);
    }
  };

  const handleCompletedTodo = async (id: number, completed: boolean) => {
    setCompletingIds(prev => Array.from(new Set([...prev, id])));

    try {
      const updatedTodo = await completeTodo(id, completed);

      setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      throw error;
    } finally {
      setCompletingIds(prev => prev.filter(todoId => todoId !== id));
    }
  };

  const handleToggleAllTodos = async (completed: boolean) => {
    const todosToUpdate = todos.filter(todo => todo.completed !== completed);

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setCompletingIds(prev => Array.from(new Set([...prev, ...idsToUpdate])));

    const updatePromises = todosToUpdate.map(todo =>
      completeTodo(todo.id, completed)
        .then(updatedTodo => ({ id: todo.id, success: true, updatedTodo }))
        .catch(() => ({ id: todo.id, success: false, updatedTodo: null })),
    );

    try {
      const results = await Promise.all(updatePromises);
      const successfulUpdates = results.filter(
        (result): result is { id: number; success: true; updatedTodo: Todo } =>
          result.success && result.updatedTodo !== null,
      );

      const hasError = results.some(result => !result.success);

      setTodos(prev =>
        prev.map(todo => {
          const updated = successfulUpdates.find(
            result => result.id === todo.id,
          );

          return updated ? updated.updatedTodo : todo;
        }),
      );

      if (hasError) {
        throw new Error('Unable to update a todo');
      }
    } finally {
      setCompletingIds(prev =>
        prev.filter(todoId => !idsToUpdate.includes(todoId)),
      );
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleCommitEdit = async (
    id: number,
    title: string,
  ): Promise<boolean> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return true;
    }

    const originalTodo = todos.find(todo => todo.id === id);

    if (originalTodo?.title === trimmedTitle) {
      setEditingId(null);
      setEditingTitle('');

      return false;
    }

    setEditingIds(prev => [...prev, id]);

    try {
      const updatedTodo = await updateTodoTitle(id, trimmedTitle);

      setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));
      setEditingId(null);
      setEditingTitle('');
    } catch (error) {
      throw error;
    } finally {
      setEditingIds(prev => prev.filter(todoId => todoId !== id));
    }

    return false;
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  return {
    todos,
    isAdding,
    deletingIds,
    tempTodo,
    isClearing,
    completingIds,
    editingId,
    editingTitle,
    editingIds,
    setEditingTitle,
    handleAddTodo,
    handleDeleteTodo,
    handleCompletedTodo,
    handleToggleAllTodos,
    handleClearCompleted,
    handleStartEdit,
    handleCommitEdit,
    handleCancelEdit,
  };
};
