/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import * as todosService from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
// eslint-disable-next-line import/extensions
import { Header } from './components/Header';
// eslint-disable-next-line import/extensions
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Status } from './types/Status';

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Status.All);
  const [activeTodosCount, setActiveTodosCount] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);
  
  useEffect(() => {
    if (query !== '') {
      focusInput();
    }
  }, [query, focusInput]);

  if (error !== '') {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  const onEditTodo = (idTodo: number, title: string) => {
    setTodos(prevTodos => {
      return prevTodos.map(todo => {
        if (todo.id === idTodo) {
          return { ...todo, title: title };
        }

        return todo;
      });
    });
  };

  const allTodosCompleted = () => {
    return (
      todos.filter(todo => todo.completed).length === todos.length &&
      todos.length !== 0
    );
  };

  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    const newCompletedState = !areAllCompleted;

    setTodos(prevTodos =>
      prevTodos.map(todo => ({
        ...todo,
        completed: newCompletedState,
        isTemp: true,
      })),
    );

    setLoading(true);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedState,
    );

    setActiveTodosCount(() =>
      newCompletedState
        ? 0
        : todos.filter(todo => !todo.completed && !todo.isTemp).length,
    );

    const updatePromises = todosToUpdate.map(todo =>
      todosService
        .patchTodo(todo.id, { completed: newCompletedState })
        .then(() => {
          setTodos(prevTodos =>
            prevTodos.map(t =>
              t.id === todo.id ? { ...t, isTemp: false } : t,
            ),
          );
        })
        .catch(() => setError('Unable to update todos')),
    );

    Promise.all(updatePromises)
      .then(() => setTimeout(() => setLoading(false), 1000))
      .catch(() => setLoading(false));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim() === '') {
      setError('Title should not be empty');

      return;
    }

    setLoading(true);

    const temporaryTodo = {
      id: 0,
      title: query.trim(),
      userId: todosService.USER_ID,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    try {
      const createdTodo: Todo = await todosService.postTodo(temporaryTodo);

      setTodos((currentTodos: Todo[]) => [...currentTodos, createdTodo]);
      setQuery('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setLoading(false);

      focusInput();
    }
  };

  const handleToggle = (todoId: number) => {
    setLoading(true);

    const todoToUpdate = todos.find(todo => todo.id === todoId);

    if (!todoToUpdate) {
      return;
    }

    todosService
      .patchTodo(todoToUpdate.id, { completed: !todoToUpdate.completed })
      .then(() => {
        setTimeout(() => {
          setTodos(currentTodos =>
            currentTodos.map(todo =>
              todo.id === todoId
                ? { ...todo, completed: !todo.completed }
                : todo,
            ),
          );
          setLoading(false);
        }, 500);
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => setLoading(false));
  };

  const deleteTodo = (todoId: number) => {
    setLoading(true);
    todosService
      .deleteTodo(todoId)
      .then(() =>
        setTimeout(() => {
          setTodos(currentTodos => {
            return currentTodos.filter(todo => todo.id !== todoId);
          });

        }, 500),
      )
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        focusInput();
        setLoading(false);
      });
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === Status.Active) {
      return !todo.completed;
    }

    if (filter === Status.Completed) {
      return todo.completed;
    }

    return todo;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onQuery={setQuery}
          loading={loading}
          inputRef={inputRef}
          onSubmit={handleSubmit}
          query={query}
          onToggleAll={handleToggleAll}
          completed={allTodosCompleted}
          todos={todos}
        />
        <TodoList
          onToggle={handleToggle}
          onDeleteTodo={deleteTodo}
          loading={loading}
          filtered={filteredTodos}
          tempTodo={tempTodo}
          onError={setError}
          onEditTodo={onEditTodo}
          onLoading={setLoading}
        />

        {!!todos.length && (
          <Footer
            onFilter={setFilter}
            onError={setError}
            onTodos={setTodos}
            todos={todos}
            filter={filter}
            focus={focusInput}
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
          { hidden: error === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
