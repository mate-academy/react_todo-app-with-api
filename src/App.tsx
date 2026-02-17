import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import {
  USER_ID,
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

import { Header, HeaderRef } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { UserWarning } from './UserWarning';

import { Filter } from './enums/Filter';
import { ErrorMessage } from './enums/ErrorMessage';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState('');
  const [visibleError, setVisibleError] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const headerRef = useRef<HeaderRef>(null);

  const showError = (message: string) => {
    setError(message);
    setVisibleError(true);
    setTimeout(() => setVisibleError(false), 3000);
  };

  const hideError = () => setVisibleError(false);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.Load));
  }, []);

  const handleAdd = async (title: string): Promise<boolean> => {
    const trimmed = title.trim();

    if (!trimmed) {
      showError(ErrorMessage.EmptyTitle);
      headerRef.current?.focus();

      return false;
    }

    hideError();
    setTempTodo({ id: 0, userId: USER_ID, title: trimmed, completed: false });
    setIsAdding(true);

    try {
      const newTodo = await createTodo({
        userId: USER_ID,
        title: trimmed,
        completed: false,
      });

      setTodos(prev => [...prev, newTodo]);
      setTempTodo(null);

      return true;
    } catch {
      showError(ErrorMessage.Add);
      setTempTodo(null);

      return false;
    } finally {
      setIsAdding(false);
      setTimeout(() => headerRef.current?.focus(), 0);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoadingIds(prev => [...prev, id]);
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError(ErrorMessage.Delete);
    } finally {
      setLoadingIds(prev => prev.filter(curr => curr !== id));
      setTimeout(() => headerRef.current?.focus(), 0);
    }
  };

  const handleUpdate = async (id: number, data: Partial<Todo>) => {
    try {
      setLoadingIds(prev => [...prev, id]);
      const updatedTodo = await updateTodo({ id, ...data });

      setTodos(prev => prev.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch {
      showError(ErrorMessage.Update);
      throw new Error();
    } finally {
      setLoadingIds(prev => prev.filter(curr => curr !== id));
    }
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(todo => todo.completed === allCompleted);

    todosToUpdate.forEach(todo =>
      handleUpdate(todo.id, { completed: !allCompleted }),
    );
  };

  const handleClearCompleted = () => {
    todos.filter(todo => todo.completed).forEach(todo => handleDelete(todo.id));
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(t => !t.completed);
      case Filter.Completed:
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          ref={headerRef}
          onAdd={handleAdd}
          disabled={isAdding}
          todos={todos}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingIds={loadingIds}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={todos.filter(t => !t.completed).length}
            completedCount={todos.filter(t => t.completed).length}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !visibleError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {error}
      </div>
    </div>
  );
};
