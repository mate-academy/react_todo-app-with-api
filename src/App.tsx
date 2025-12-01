/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getVisibleTodos } from './utils/getVisibleTodos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorTypes } from './types/ErrorTypes';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  postTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorTypes | null>(null);
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [filter, setFilter] = useState<Filter>(Filter.All);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getTodos();

        setTodos(data);
      } catch {
        setError(ErrorTypes.LoadTodos);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    })();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    if (!error) {
      return;
    }

    setIsErrorVisible(true);

    const timer = setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editFieldRef.current?.focus();
    }
  }, [editingTodoId]);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, filter),
    [todos, filter],
  );

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const allCompleted = todos.length > 0 && activeCount === 0;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      setError(ErrorTypes.EmptyTitle);

      return;
    }

    const newTemp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(newTemp);
    setIsLoading(true);

    try {
      const created = await postTodo({
        title: trimmed,
        userId: USER_ID,
        completed: false,
      });

      setTodos(prev => [...prev, created]);
      setTitle('');
    } catch {
      setError(ErrorTypes.AddTodo);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingTodoIds(prev => [...prev, id]);

    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch {
      setError(ErrorTypes.DeleteTodo);
    } finally {
      setLoadingTodoIds(prev => prev.filter(tid => tid !== id));
      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completed = todos.filter(t => t.completed);

    try {
      const results = await Promise.allSettled(
        completed.map(t => deleteTodo(t.id)),
      );

      const successfulIds = completed
        .filter((_, i) => results[i].status === 'fulfilled')
        .map(t => t.id);

      setTodos(prev => prev.filter(t => !successfulIds.includes(t.id)));

      const failed = results.some(r => r.status === 'rejected');

      if (failed) {
        setError(ErrorTypes.DeleteTodo);
      }
    } finally {
      inputRef.current?.focus();
    }
  };

  const handleToggleCompleted = async (todo: Todo) => {
    setLoadingTodoIds(prev => [...prev, todo.id]);

    try {
      const updated = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      setError(ErrorTypes.UpdateTodo);
    } finally {
      setLoadingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const shouldComplete = todos.some(t => !t.completed);
    const toUpdate = todos.filter(t => t.completed !== shouldComplete);

    setLoadingTodoIds(prev => [...prev, ...toUpdate.map(t => t.id)]);

    try {
      const results = await Promise.allSettled(
        toUpdate.map(t => updateTodo(t.id, { completed: shouldComplete })),
      );

      const successfulIds = toUpdate
        .filter((_, idx) => results[idx].status === 'fulfilled')
        .map(t => t.id);

      setTodos(prev =>
        prev.map(todo =>
          successfulIds.includes(todo.id)
            ? { ...todo, completed: shouldComplete }
            : todo,
        ),
      );

      const failed = results.some(r => r.status === 'rejected');

      if (failed) {
        setError(ErrorTypes.UpdateTodo);
      }
    } finally {
      setLoadingTodoIds(prev =>
        prev.filter(id => !toUpdate.some(t => t.id === id)),
      );
    }
  };

  const handleStartEdit = (id: number, value: string) => {
    setEditingTodoId(id);
    setEditingTitle(value);
  };

  const handleUpdateTitle = async (todo: Todo, value: string) => {
    const trimmed = value.trim();

    setLoadingTodoIds(prev => [...prev, todo.id]);

    if (!trimmed) {
      await handleDeleteTodo(todo.id);

      return;
    }

    try {
      const updated = await updateTodo(todo.id, { title: trimmed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      setError(ErrorTypes.UpdateTodo);
    } finally {
      setEditingTodoId(null);
      setEditingTitle('');
      setLoadingTodoIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleHideError = () => {
    setError(null);
    setIsErrorVisible(false);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          title={title}
          setTitle={setTitle}
          onAdd={handleAddTodo}
          onToggleAll={handleToggleAll}
          allCompleted={allCompleted}
          hasTodos={todos.length > 0}
          isLoading={isLoading}
          inputRef={inputRef}
        />

        {!!todos.length && (
          <TodoList
            visibleTodos={visibleTodos}
            tempTodo={tempTodo}
            editingTodoId={editingTodoId}
            editingTitle={editingTitle}
            loadingTodoIds={loadingTodoIds}
            onStartEdit={handleStartEdit}
            onUpdateTitle={handleUpdateTitle}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleCompleted}
            editFieldRef={editFieldRef}
            inputRef={inputRef}
            onCancelEdit={handleCancelEdit}
          />
        )}

        {todos.length > 0 && (
          <TodoFooter
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        error={error}
        isVisible={isErrorVisible}
        onHide={handleHideError}
      />
    </div>
  );
};
