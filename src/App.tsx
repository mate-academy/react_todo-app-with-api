/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (errorMessage) {
      const timer = window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      return;
    }

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temp);

    try {
      const created = await createTodo({
        userId: USER_ID,
        title,
        completed: false,
      });

      setTodos(prev => [...prev, created]);
      setNewTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleDelete = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(item => item !== id));
      inputRef.current?.focus();
    }
  };

  const handleToggle = async (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    try {
      const updated = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.length > 0 && todos.every(t => t.completed);

    const toUpdate = todos.filter(t => t.completed === allCompleted);

    await Promise.all(toUpdate.map(todo => handleToggle(todo)));
  };

  const handleEditStart = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleEditSave = async (todo: Todo) => {
    const trimmed = editingTitle.trim();

    if (trimmed === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmed) {
      setLoadingIds(prev => [...prev, todo.id]);

      try {
        await deleteTodo(todo.id);

        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setEditingId(null);
      } catch {
        setErrorMessage('Unable to delete a todo');

        return;
      } finally {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      }

      return;
    }

    setLoadingIds(prev => [...prev, todo.id]);

    try {
      const updated = await updateTodo(todo.id, {
        title: trimmed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));

      setEditingId(null);
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterType.Active:
        return todos.filter(todo => !todo.completed);
      case FilterType.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleClearCompleted = () => {
    Promise.all(
      todos.filter(todo => todo.completed).map(todo => handleDelete(todo.id)),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          newTitle={newTitle}
          tempTodo={tempTodo}
          inputRef={inputRef}
          onToggleAll={handleToggleAll}
          onSubmit={handleSubmit}
          onNewTitleChange={setNewTitle}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            editingId={editingId}
            editingTitle={editingTitle}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditTitleChange={setEditingTitle}
            onEditCancel={() => setEditingId(null)}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            hasCompleted={hasCompleted}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
