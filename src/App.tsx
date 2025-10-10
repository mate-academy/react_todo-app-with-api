/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, updateTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 0;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    if (!USER_ID) {
      getTodos(USER_ID)
        .then(setTodos)
        .catch(() => setErrorMessage('Unable to load todos'))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleToggleTodo = useCallback(
    async (todoId: number) => {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        return;
      }

      setLoadingIds(prev => [...prev, todoId]);

      try {
        const updatedTodo = await updateTodo(todoId, {
          completed: !todoToUpdate.completed,
        });

        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      }
    },
    [todos],
  );

  const handleToggleAll = useCallback(async () => {
    const areAllCompleted =
      todos.length > 0 && todos.every(todo => todo.completed);
    const newStatus = !areAllCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingIds(prev => [...prev, ...todosToUpdate.map(todo => todo.id)]);

    try {
      const updatePromises = todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: newStatus }),
      );

      const updatedTodos = await Promise.all(updatePromises);

      setTodos(prev =>
        prev.map(todo => {
          const updatedTodo = updatedTodos.find(t => t.id === todo.id);

          return updatedTodo || todo;
        }),
      );
    } catch {
      setErrorMessage('Unable to update todos');
    } finally {
      setLoadingIds(prev =>
        prev.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  }, [todos]);

  const handleEditTodo = useCallback(
    async (todoId: number) => {
      const todoToEdit = todos.find(todo => todo.id === todoId);

      if (!todoToEdit) {
        return;
      }

      const trimmedTitle = editTitle.trim();

      if (!trimmedTitle) {
        setLoadingIds(prev => [...prev, todoId]);
        try {
          await deleteTodo(todoId);
          setTodos(prev => prev.filter(todo => todo.id !== todoId));
        } catch {
          setErrorMessage('Unable to delete a todo');
        } finally {
          setLoadingIds(prev => prev.filter(id => id !== todoId));
          setEditingId(null);
        }

        return;
      }

      if (trimmedTitle === todoToEdit.title) {
        setEditingId(null);

        return;
      }

      setLoadingIds(prev => [...prev, todoId]);
      try {
        const updatedTodo = await updateTodo(todoId, { title: trimmedTitle });

        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
        setEditingId(null);
      }
    },
    [todos, editTitle],
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setEditingId(null);

        const currentTodo = todos.find(todo => todo.id === editingId);

        if (currentTodo) {
          setEditTitle(currentTodo.title);
        }
      }
    };

    document.addEventListener('keyup', handleEscape);

    return () => document.removeEventListener('keyup', handleEscape);
  }, [editingId, todos]);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);
    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todoId));
    }
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          onToggleAll={handleToggleAll}
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          userId={USER_ID}
          setLoadingIds={setLoadingIds}
        />

        <TodoList
          todos={todos}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          editingId={editingId}
          setEditingId={setEditingId}
          onEditTodo={handleEditTodo}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
        />
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
