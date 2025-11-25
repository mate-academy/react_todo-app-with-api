/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  updateTodo,
  getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import classNames from 'classnames';
import { Header } from './components/Header';
import { MainSection } from './components/MainSection';
import { Footer } from './components/Footer';
import { FilterStatus } from './types/FilterStatus';
import { TodoItem } from './components/TodoItem';
import { ErrorMessages } from './types/ErrorMessages';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [currentError, setCurrentError] = useState<ErrorMessages | ''>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.All,
  );
  const errorTimerId = useRef<number | null>(null);

  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'id'> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState(new Set<number>());

  const [updatingTodoId, setUpdatingTodoId] = useState<number | null>(null);

  const newTodoInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    const newTodoData = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodoData);

    if (trimmedTitle === '') {
      setCurrentError(ErrorMessages.EmptyTitleError);

      return;
    }

    setCurrentError('');
    setIsProcessing(true);
    setTempTodo(newTodoData);

    try {
      const createdTodo = await addTodo(trimmedTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);
      setTitle('');
    } catch (err) {
      setCurrentError(ErrorMessages.AddTodoError);
    } finally {
      setIsProcessing(false);
      setTempTodo(null);

      if (newTodoInputRef.current) {
        const inputElement = newTodoInputRef.current;

        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  const handleDelete = async (todoId: number) => {
    setCurrentError('');
    setDeletingTodoIds(prevIds => new Set(prevIds).add(todoId));

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (err) {
      setCurrentError(ErrorMessages.DeleteTodoError);
      throw err;
    } finally {
      setDeletingTodoIds(prevIds => {
        const newIds = new Set(prevIds);

        newIds.delete(todoId);

        return newIds;
      });

      if (newTodoInputRef.current) {
        const inputElement = newTodoInputRef.current;

        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setCurrentError('');
    setIsProcessing(true);

    const deletionPromises = completedTodos.map(todo => {
      return deleteTodo(todo.id);
    });

    try {
      const results = await Promise.allSettled(deletionPromises);

      const successfulDeletions = results
        .map((result, index) => ({ result, todo: completedTodos[index] }))
        .filter(item => item.result.status === 'fulfilled')
        .map(item => item.todo.id);

      const failedDeletions = results.filter(
        result => result.status === 'rejected',
      );

      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
      );

      if (failedDeletions.length > 0) {
        setCurrentError(ErrorMessages.DeleteTodoError);
      }
    } catch (err) {
      setCurrentError(ErrorMessages.DeleteTodoError);
    } finally {
      setIsProcessing(false);

      if (newTodoInputRef.current) {
        const inputElement = newTodoInputRef.current;

        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  const handleUpdate = async (todoId: number, updatedFields: Partial<Todo>) => {
    setCurrentError('');
    setUpdatingTodoId(todoId);

    try {
      const updatedTodo = await updateTodo(todoId, updatedFields);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );
    } catch (err) {
      setCurrentError(ErrorMessages.UpdateTodoError);
      throw err;
    } finally {
      setUpdatingTodoId(null);

      if (newTodoInputRef.current) {
        const inputElement = newTodoInputRef.current;

        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  const handleToggleAll = async () => {
    const newStatus = !todos.every(todo => todo.completed);
    const todosToChange = todos.filter(todo => todo.completed !== newStatus);

    if (todosToChange.length === 0) {
      return;
    }

    setCurrentError('');
    setIsProcessing(true);

    const updatingPromises = todosToChange.map(todo => {
      return client.patch(`/todos/${todo.id}`, { completed: newStatus });
    });

    try {
      const results = await Promise.allSettled(updatingPromises);

      const successfulUpdatingIds = results
        .map((result, index) => ({ result, todo: todosToChange[index] }))
        .filter(item => item.result.status === 'fulfilled')
        .map(item => item.todo.id);

      const failedUpdatingIds = results.filter(
        result => result.status === 'rejected',
      );

      setTodos(currentTodos =>
        currentTodos.map(todo => {
          if (successfulUpdatingIds.includes(todo.id)) {
            return { ...todo, completed: newStatus };
          }

          return todo;
        }),
      );

      if (failedUpdatingIds.length > 0) {
        setCurrentError(ErrorMessages.UpdateTodoError);
      }
    } catch (err) {
      setCurrentError(ErrorMessages.UpdateTodoError);
    } finally {
      setIsProcessing(false);

      if (newTodoInputRef.current) {
        const inputElement = newTodoInputRef.current;

        setTimeout(() => {
          inputElement.focus();
        }, 0);
      }
    }
  };

  const error = currentError;

  const visibleTodos = (todos || []).filter(todo => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      case FilterStatus.All:
      default:
        return true;
    }
  });

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  useEffect(() => {
    const loadTodos = async () => {
      setIsAppLoading(true);
      setCurrentError('');

      try {
        const fetchedTodos = await getTodos();

        setTodos(fetchedTodos);
      } catch (err) {
        setCurrentError(ErrorMessages.LoadTodosError);
      } finally {
        setIsAppLoading(false);
      }
    };

    loadTodos();
  }, []);

  const hideError = () => {
    setCurrentError('');
  };

  useEffect(() => {
    if (error) {
      if (errorTimerId.current !== null) {
        clearTimeout(errorTimerId.current);
        errorTimerId.current = null;
      }

      const newTimerId = setTimeout(() => {
        hideError();
      }, 3000) as unknown as number;

      errorTimerId.current = newTimerId;
    }

    return () => {
      if (errorTimerId.current !== null) {
        clearTimeout(errorTimerId.current);
      }
    };
  }, [error]);

  useEffect(() => {
    if (!isAppLoading && newTodoInputRef.current) {
      newTodoInputRef.current.focus();
    }
  }, [isAppLoading]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeCount={activeCount}
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          isAppLoading={isAppLoading || isProcessing}
          newTodoInputRef={newTodoInputRef}
          handleToggleAll={handleToggleAll}
        />

        {isAppLoading && (
          <p className="notification is-info is-light">Loading todos...</p>
        )}

        <MainSection
          todos={todos}
          visibleTodos={visibleTodos}
          handleDelete={handleDelete}
          deletingTodoIds={deletingTodoIds}
          handleUpdate={handleUpdate}
          updatingTodoId={updatingTodoId}
        />

        {tempTodo && (
          <section className="todoapp__main" data-cy="TodoList">
            <ul className="todo-list">
              <TodoItem todo={tempTodo} isTemp={true} />
            </ul>
          </section>
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            hasCompleted={hasCompleted}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />

        {error && <p>{error}</p>}
      </div>
    </div>
  );
};
