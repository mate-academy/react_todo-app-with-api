/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { NewTodo } from './components/NewTodo';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { FilterType, FILTERS } from './filtersAll/filters';

export const App: React.FC = () => {
  // hooks
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);
  const [editingId, setEditingId] = useState<number | null>(null);

  // showError
  const showError = (message: string) => {
    setErrorMessage(message);
  };

  const hideError = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    if (USER_ID) {
      getTodos(USER_ID)
        .then(setTodos)
        .catch(() => showError('Unable to load todos'));
    }
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timerId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [errorMessage]);

  const handleAddTodo = async (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: -Math.random() });

    try {
      const createdTodo = await addTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    try {
      await deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch {
      showError('Unable to delete a todo');
    } finally {
      setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    setLoadingIds(prev => [...prev, updatedTodo.id]);
    try {
      const todo = await updateTodo(updatedTodo);

      setTodos(prevTodos =>
        prevTodos.map(t => (t.id === updatedTodo.id ? todo : t)),
      );
    } catch {
      showError('Unable to update a todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== updatedTodo.id));
    }
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const targetStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);
    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setLoadingIds(prev => [...prev, ...idsToUpdate]);

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo({ ...todo, completed: targetStatus }),
        ),
      );

      setTodos(prevTodos =>
        prevTodos.map(todo => {
          const updatedTodo = updatedTodos.find(t => t.id === todo.id);

          return updatedTodo || todo;
        }),
      );
    } catch {
      showError('Unable to update todo');
    } finally {
      setLoadingIds(prev => prev.filter(id => !idsToUpdate.includes(id)));
    }
  };

  const handleEditStart = (id: number) => {
    setEditingId(id);
  };

  const handleEditSave = async (id: number, newTitle: string) => {
    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    if (newTitle === todoToUpdate.title) {
      setEditingId(null);

      return;
    }

    if (!newTitle.trim()) {
      await handleDeleteTodo(id);

      return;
    }

    setLoadingIds(prev => [...prev, id]);

    try {
      await handleUpdateTodo({ ...todoToUpdate, title: newTitle.trim() });
      setEditingId(null);
    } catch {
      showError('Unable to update a todo');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FILTERS.active:
        return !todo.completed;
      case FILTERS.completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: isAllCompleted,
            })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
          />

          <NewTodo onAdd={handleAddTodo} />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          editingId={editingId}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
          onEditStart={handleEditStart}
          onEditSave={handleEditSave}
          onEditCancel={handleEditCancel}
        />

        <Footer
          todos={todos}
          filter={filter}
          onFilterChange={handleFilterChange}
          onClearCompleted={handleClearCompleted}
        />
      </div>

      <ErrorNotification errorMessage={errorMessage} onClose={hideError} />
    </div>
  );
};
