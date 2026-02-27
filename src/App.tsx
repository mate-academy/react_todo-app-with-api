/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import {
  getTodos,
  addTodo,
  deleteTodo,
  USER_ID,
  updateTodo,
} from './api/todos';
import { Filter, ErrorMessage } from './types/enums';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showError, setShowError] = useState<ErrorMessage | ''>('');
  const [filterSelected, setFilterSelected] = useState(Filter.All);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const todoFieldRef = React.useRef<HTMLInputElement>(null);

  const focusField = () => {
    if (todoFieldRef.current) {
      todoFieldRef.current.focus();
    }
  };

  const handleDelete = useCallback((todoId: number) => {
    setLoadingIds(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setShowError(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
        focusField();
      });
  }, []);

  const handleUpdate = useCallback(
    (todoId: number, title: string, completed: boolean) => {
      setLoadingIds(prev => [...prev, todoId]);

      return updateTodo(todoId, title, completed)
        .then(updatedTodo => {
          setTodos(prevTodos =>
            prevTodos.map(t => (t.id === todoId ? updatedTodo : t)),
          );
        })
        .catch(error => {
          setShowError(ErrorMessage.Update);
          throw error;
        })
        .finally(() => {
          setLoadingIds(prev => prev.filter(id => id !== todoId));
          focusField();
        });
    },
    [],
  );

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const targetStatus = !allCompleted;

    todos.forEach(todo => {
      if (todo.completed !== targetStatus) {
        handleUpdate(todo.id, todo.title, targetStatus);
      }
    });
  };

  useEffect(() => {
    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setShowError(ErrorMessage.Fetch);
      });
  }, []);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [showError]);

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesFilter =
        filterSelected === Filter.All ||
        (filterSelected === Filter.Completed && todo.completed) ||
        (filterSelected === Filter.Active && !todo.completed);

      return matchesFilter;
    });
  }, [todos, filterSelected]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          USER_ID={USER_ID}
          addTodo={addTodo}
          setTodos={setTodos}
          setShowError={setShowError}
          setTempTodo={setTempTodo}
          todoFieldRef={todoFieldRef}
          handleToggleAll={handleToggleAll}
          todos={todos}
        />

        <TodoList
          todos={visibleTodos}
          deletingIds={loadingIds}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        />

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            deleting={true}
            handleDelete={() => {}}
            handleUpdate={handleUpdate}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todosLeft={todosLeft}
            filterSelected={filterSelected}
            setFilterSelected={setFilterSelected}
            todos={todos}
            handleDelete={handleDelete}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !showError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setShowError('')}
        />
        {showError}
      </div>
    </div>
  );
};
