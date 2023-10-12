/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID, addTodo, deleteTodo, getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { List } from './components/List/List';
import { Footer } from './components/Footer/Footer';
import { handleError } from './handleError';
import { ErrorMessage } from './types/ErrorMessage';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const counter = () => {
    return todos.filter(todo => !todo.completed).length;
  };

  const visibleTodos = () => {
    const visible = [...todos].filter(todo => {
      if (filter === 'Active' && todo.completed) {
        return false;
      }

      if (filter === 'Completed' && !todo.completed) {
        return false;
      }

      return true;
    });

    return visible;
  };

  const handleSubmit = (event: React.FormEvent<Element>) => {
    event.preventDefault();
    if (!title.trim()) {
      handleError(setErrorMessage, ErrorMessage.noTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
      editing: true,
    };

    setTempTodo(newTodo);

    setIsLoading(true);
    addTodo(newTodo)
      .then((response) => {
        setTitle('');
        setTodos((oldTodos) => [...oldTodos, response]);
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessage.noAddTodo);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (todoId: number) => {
    setTodos(prevTodos => prevTodos.map(todo => (todo.id === todoId ? { ...todo, editing: true } : todo)));
    deleteTodo(todoId).then(() => {
      setTodos((oldTodos) => oldTodos.filter(todo => todo.id !== todoId));
    }).catch(() => {
      handleError(setErrorMessage, ErrorMessage.noDeleteTodo);
    });
  };

  const handleToggleAll = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    Promise.all(updatedTodos.map(todo => updateTodo(todo.id, { completed: todo.completed })))
      .then(() => {
        setTodos(updatedTodos);
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessage.noUpdateTodo);
      })
      .finally(() => {
      });
  };

  const handleStatusChange = (todoId: number, completed: boolean) => {
    setTodos(prevTodos => prevTodos.map(todo => (todo.id === todoId ? { ...todo, completed, editing: true } : todo)));

    updateTodo(todoId, { completed })
      .then(updatedTodo => {
        setTodos(
          prevTodos => prevTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessage.noUpdateTodo);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessage.noDeleteTodo);
      });
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((todo) => {
        setTodos(todo);
        setTitle('');
      })
      .catch(() => {
        handleError(setErrorMessage, ErrorMessage.noTodos);
      }).finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          handleSubmit={handleSubmit}
          todos={todos}
          isLoading={isLoading}
          onToggleAll={handleToggleAll}
        />
        {todos.length > 0
        && (
          <List
            todos={visibleTodos()}
            tempTodo={tempTodo}
            handleDelete={handleDelete}
            onStatusChange={handleStatusChange}
            setTodos={setTodos}
            isLoading={false}
            isDeleting={false}
            isToggling={false}
            isTogglingAll={false}
          />
        )}
        {todos.length > 0 && (
          <Footer
            counter={counter()}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
            todos={todos}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          !errorMessage && 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
          aria-label="Close error notification"
        />
        {errorMessage}
        <br />
      </div>
    </div>
  );
};
