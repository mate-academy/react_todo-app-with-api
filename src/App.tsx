/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { StatusFilter } from './types/StatusFilter';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<StatusFilter>(StatusFilter.All);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoValue, setTodoValue] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === StatusFilter.Active) {
      return !todo.completed;
    }

    if (filter === StatusFilter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedValue = todoValue.trim();

    if (!trimmedValue) {
      setError('Title should not be empty');

      return;
    }

    setIsAdding(true);

    setTempTodo({
      id: 0,
      title: trimmedValue,
      completed: false,
      userId: USER_ID,
    });

    setLoadingTodoIds(prev => [...prev, 0]);

    createTodo(trimmedValue)
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setTodoValue('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        setLoadingTodoIds(ids => ids.filter(id => id !== 0));
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleDelete = (todoId: number, onSuccess?: () => void) => {
    setLoadingTodoIds([...loadingTodoIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== todoId));
        onSuccess?.();
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(loadingTodoIds.filter(id => id !== todoId));
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    let completedCount = completedTodos.length;

    completedTodos.forEach(todo => {
      setLoadingTodoIds([...loadingTodoIds, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError('Unable to delete a todo');
        })
        .finally(() => {
          setLoadingTodoIds(loadingTodoIds.filter(id => id !== todo.id));
          completedCount--;

          if (completedCount === 0) {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }
        });
    });
  };

  const handleToggle = (todoId: number) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setLoadingTodoIds([...loadingTodoIds, todoId]);

    updateTodo(todoId, { completed: !todoToUpdate.completed })
      .then(updatedTodo => {
        setTodos(toDos =>
          toDos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(loadingTodoIds.filter(id => id !== todoId));
      });
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = !(
      todos.length > 0 && todos.every(todo => todo.completed)
    );

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    todosToUpdate.forEach(todo => {
      handleToggle(todo.id);
    });
  };

  const handleUpdate = (
    todoId: number,
    newTitle: string,
    onSuccess: () => void = () => {},
  ) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    setLoadingTodoIds([...loadingTodoIds, todoId]);

    updateTodo(todoId, { title: newTitle })
      .then(updatedTodo => {
        setTodos(toDos =>
          toDos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
        onSuccess();
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        setLoadingTodoIds(ids => ids.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const shouldShowMain = todos.length > 0;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoValue={todoValue}
          setTodoValue={setTodoValue}
          handleSubmit={handleSubmit}
          isAdding={isAdding}
          allCompleted={todos.length > 0 && todos.every(todo => todo.completed)}
          handleToggleAll={handleToggleAll}
          shouldShowToggleAll={todos.length > 0}
          inputRef={inputRef}
        />

        {loading && (
          <div className="has-text-centered p-4" data-cy="Loading">
            Loading...
          </div>
        )}

        {!loading && shouldShowMain && (
          <TodoList
            todos={[...filteredTodos, ...(tempTodo ? [tempTodo] : [])]}
            loadingTodoIds={loadingTodoIds}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
          />
        )}

        {!loading && shouldShowMain && (
          <Footer
            todos={todos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
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
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
