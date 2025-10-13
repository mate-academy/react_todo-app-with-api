/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, updateTodo, deleteTodo, createTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem('todoUserId');
    const numericUserId = savedUserId ? Number(savedUserId) : 1;

    setUserId(numericUserId);

    if (numericUserId) {
      getTodos(numericUserId)
        .then(setTodos)
        .catch(() => setErrorMessage('Unable to load todos'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleToggleTodo = useCallback(
    async (todoId: number) => {
      if (loadingIds.includes(todoId)) {
        return;
      }

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
    [todos, loadingIds],
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
      setErrorMessage('Unable to update a todo'); // Mensagem unificada
    } finally {
      setLoadingIds(prev =>
        prev.filter(id => !todosToUpdate.some(todo => todo.id === id)),
      );
    }
  }, [todos]);

  const handleEditTodo = useCallback(
    async (todoId: number) => {
      if (loadingIds.includes(todoId)) {
        return;
      }

      const todoToEdit = todos.find(todo => todo.id === todoId);

      if (!todoToEdit) {
        return;
      }

      const trimmedTitle = editTitle.trim();

      // Título vazio = deletar
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
    [todos, editTitle, loadingIds],
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && editingId) {
        const currentTodo = todos.find(todo => todo.id === editingId);

        if (currentTodo) {
          setEditTitle(currentTodo.title);
        }

        setEditingId(null);
      }
    };

    document.addEventListener('keyup', handleEscape);

    return () => document.removeEventListener('keyup', handleEscape);
  }, [editingId, todos]);

  const handleDeleteTodo = useCallback(
    async (todoId: number) => {
      if (loadingIds.includes(todoId)) {
        return;
      }

      setLoadingIds(prev => [...prev, todoId]);
      try {
        await deleteTodo(todoId);
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
      }
    },
    [loadingIds],
  );

  const handleAddTodo = useCallback(
    async (title: string) => {
      if (!title.trim() || !userId) {
        return;
      }

      setIsAdding(true);
      try {
        const newTodo = await createTodo({
          userId,
          title: title.trim(),
          completed: false,
        });

        setTodos(prev => [...prev, newTodo]);
      } catch {
        setErrorMessage('Unable to add a todo');
      } finally {
        setIsAdding(false);
      }
    },
    [userId],
  );

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setLoadingIds(prev => [...prev, ...completedTodos.map(todo => todo.id)]);

    try {
      await Promise.all(completedTodos.map(todo => deleteTodo(todo.id)));
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch {
      setErrorMessage('Unable to delete completed todos');
    } finally {
      setLoadingIds(prev =>
        prev.filter(id => !completedTodos.some(todo => todo.id === id)),
      );
    }
  }, [todos]);

  // Warning se não tiver userId válido
  if (!userId || userId <= 0) {
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
          onAddTodo={handleAddTodo}
          isAdding={isAdding}
        />

        <TodoList
          todos={todos}
          loadingIds={loadingIds}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          editingId={editingId}
          setEditingId={setEditingId}
          onEditTodo={handleEditTodo}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
        />

        {/* Footer com contadores e botão para limpar completados */}
        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleClearCompleted}
              disabled={!todos.some(todo => todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
