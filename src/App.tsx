/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { NotificationMessage } from './types/Notifications';
import { Header } from './Components/Header';
import { MainSection } from './Components/MainSection';
import { Footer } from './Components/Footer';
import { ErrorNotification } from './Components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notification, setNotification] = useState<{
    message: NotificationMessage | null;
    visible: boolean;
  }>({ message: null, visible: false });
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [newTodoText, setNewTodoText] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [creating, setCreating] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const newTodoRef = useRef<HTMLInputElement>(null);
  const deletingIdsArray = useMemo(() => deletingIds, [deletingIds]);
  const updatingIdsArray = useMemo(() => updatingIds, [updatingIds]);
  const notificationTimerRef = useRef<number | null>(null);

  const hideNotification = () => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
      notificationTimerRef.current = null;
    }

    setNotification({ message: null, visible: false });
  };

  const showNotification = (message: NotificationMessage) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    setNotification({ message, visible: true });
    notificationTimerRef.current = window.setTimeout(() => {
      setNotification({ message, visible: false });
      notificationTimerRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => showNotification(NotificationMessage.UnableToLoadTodos));
  }, []);

  useEffect(() => {
    if (!creating && deletingIds.length === 0) {
      newTodoRef.current?.focus();
    }
  }, [creating, deletingIds.length]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const title = newTodoText.trim();

    if (!title) {
      showNotification(NotificationMessage.TitleEmpty);

      return;
    }

    setCreating(true);
    setTempTodo({ id: 0, userId: USER_ID, title, completed: false });

    try {
      const createdTodo = await createTodo({
        title,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, createdTodo]);
      setNewTodoText('');
    } catch {
      showNotification(NotificationMessage.UnableToAdd);
    } finally {
      setTempTodo(null);
      setCreating(false);
    }
  };

  const handleDeleteTodo = async (id: number): Promise<boolean> => {
    setDeletingIds(prev => (prev.includes(id) ? prev : [...prev, id]));

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));

      if (editingId === id) {
        setEditingId(null);
      }

      return true;
    } catch {
      showNotification(NotificationMessage.UnableToDelete);

      return false;
    } finally {
      setDeletingIds(prev => prev.filter(p => p !== id));
    }
  };

  const handleRenameTodo = async (
    id: number,
    newTitle: string,
  ): Promise<boolean> => {
    setUpdatingIds(prev => (prev.includes(id) ? prev : [...prev, id]));

    try {
      const updated = await updateTodo(id, { title: newTitle });

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));

      return true;
    } catch {
      showNotification(NotificationMessage.UnableToUpdate);

      return false;
    } finally {
      setUpdatingIds(prev => prev.filter(p => p !== id));
    }
  };

  const handleSubmitEdit = async (id: number, rawTitle: string) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      setEditingId(null);

      return;
    }

    const trimmed = rawTitle.trim();

    if (trimmed === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmed) {
      const deleted = await handleDeleteTodo(id);

      if (deleted) {
        setEditingId(null);
      }

      return;
    }

    const updated = await handleRenameTodo(id, trimmed);

    if (updated) {
      setEditingId(null);
    }
  };

  const handleToggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    setUpdatingIds(prev => [...prev, id]);

    try {
      const updated = await updateTodo(id, { completed: !todo.completed });

      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch {
      showNotification(NotificationMessage.UnableToUpdate);
    } finally {
      setUpdatingIds(prev => prev.filter(p => p !== id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(t => t.completed);
    const newStatus = !allCompleted;
    const targets = todos.filter(t => t.completed !== newStatus);

    if (!targets.length) {
      return;
    }

    const ids = targets.map(t => t.id);

    setUpdatingIds(prev => [...prev, ...ids]);

    const results = await Promise.allSettled(
      targets.map(t => updateTodo(t.id, { completed: newStatus })),
    );

    const succeeded: Todo[] = [];

    results.forEach(r => {
      if (r.status === 'fulfilled') {
        succeeded.push(r.value);
      }
    });

    if (succeeded.length) {
      const succeededById = new Map(succeeded.map(t => [t.id, t]));

      setTodos(prev => prev.map(t => succeededById.get(t.id) || t));
    }

    if (results.some(r => r.status === 'rejected')) {
      showNotification(NotificationMessage.UnableToUpdate);
    }

    setUpdatingIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    if (!completed.length) {
      return;
    }

    const ids = completed.map(t => t.id);

    setDeletingIds(prev => [...prev, ...ids.filter(id => !prev.includes(id))]);

    const results = await Promise.allSettled(
      completed.map(t => deleteTodo(t.id)),
    );

    const succeededIds = completed
      .filter((_, i) => results[i].status === 'fulfilled')
      .map(t => t.id);

    if (succeededIds.length) {
      setTodos(prev => prev.filter(t => !succeededIds.includes(t.id)));
    }

    if (results.some(r => r.status === 'rejected')) {
      showNotification(NotificationMessage.UnableToDelete);
    }

    setDeletingIds(prev => prev.filter(id => !ids.includes(id)));
  };

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case Filter.ACTIVE:
        return todos.filter(t => !t.completed);
      case Filter.COMPLETED:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const allCompleted = todos.length > 0 && todos.every(t => t.completed);
  const remaining = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoText={newTodoText}
          onChange={setNewTodoText}
          onSubmit={handleAddTodo}
          newTodoRef={newTodoRef}
          isDisabled={creating}
          hasTodos={todos.length > 0}
          allCompleted={allCompleted}
          onToggleAll={handleToggleAll}
        />

        {(visibleTodos.length > 0 || tempTodo) && (
          <MainSection
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            deletingIds={deletingIdsArray}
            onDelete={handleDeleteTodo}
            updatingIds={updatingIdsArray}
            onToggle={handleToggleTodo}
            editingId={editingId}
            onStartEdit={setEditingId}
            onCancelEdit={() => setEditingId(null)}
            onSubmitEdit={handleSubmitEdit}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            remaining={remaining}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted}
            clearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        notification={notification}
        hideNotification={hideNotification}
      />
    </div>
  );
};
