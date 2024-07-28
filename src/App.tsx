import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Todo } from './types/Todo';
import {
  getTodos,
  loadTodos,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Status } from './separate/Status';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [filter, setFilter] = useState<Status>(Status.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current?.focus();
    }
  }, [todos]);

  const handleNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodoId(current => [...current, 0]);

    loadTodos(newTodo)
      .then(newTodos => {
        setTodos(prevTodos => [...prevTodos, newTodos]);
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodoId(current => current.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodoId(prevId => [...prevId, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoId(current =>
          current.filter(removedTodo => todoId !== removedTodo),
        );
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodoId = completedTodos.map(todo => todo.id);

    setLoadingTodoId(current => [...current, ...completedTodoId]);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() => {
          setLoadingTodoId(current =>
            current.filter(loading => loading !== todo.id),
          );
        });
    });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setLoadingTodoId(current => [...current, updatedTodo.id]);

    updateTodo(updatedTodo)
      .then(todo => {
        setTodos(currentTodos =>
          currentTodos.map(t => (t.id === updatedTodo.id ? todo : t)),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() =>
        setLoadingTodoId(current =>
          current.filter(todoId => todoId !== updatedTodo.id),
        ),
      );
  };

  const filterTodos = useCallback(
    (currentTodos: Todo[], currentStatus: Status) => {
      switch (currentStatus) {
        case Status.active:
          return currentTodos.filter((todo: Todo) => !todo.completed);

        case Status.completed:
          return currentTodos.filter((todo: Todo) => todo.completed);

        case Status.all:
        default:
          return currentTodos;
      }
    },
    [],
  );

  const visibleTodos = filterTodos(todos, filter);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header
          todos={todos}
          handleNewTodo={handleNewTodo}
          inputRef={inputRef}
          title={title}
          setTitle={setTitle}
          setTodos={setTodos}
          loadingTodoId={loadingTodoId}
        />

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          onUpdate={handleUpdateTodo}
          loadingTodoId={loadingTodoId}
        />
        {!!todos.length && (
          <Footer
            filter={filter}
            todos={todos}
            statusChange={setFilter}
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
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
