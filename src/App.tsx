/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  FormEventHandler, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  addTodo, deleteTodo, getTodos, editTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Errors } from './types/Errors';
import { Filter } from './types/Filters';
import { TodoFooter } from './components/TodoFooter';
import { TodoError } from './components/TodoErrors';
import { TodoForm } from './components/TodoForm';

const USER_ID = 11563;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleError = (errorMessage: Errors) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 3000);
  };

  useEffect(() => {
    if (!isSubmited) {
      inputRef.current?.focus();
    }
  }, [isSubmited]);

  const fetchData = async () => {
    try {
      const allTodos = await getTodos(USER_ID);
      const count = (allTodos).filter(todo => !todo.completed).length;

      setTodos(allTodos);
      setCounter(count);
    } catch (e) {
      handleError(Errors.loading);
    }
  };

  const handleCount = () => {
    const count = todos.filter(item => item.completed === false)
      .length;

    setCounter(count);
  };

  const handleComplete = (todo: Todo, callback: () => void) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    editTodo(todo.id, {
      completed: updatedTodo.completed,
    })
      .then(() => {
        setTodos((prevTodos) => prevTodos.map((prevTodo) => (
          prevTodo.id === todo.id ? updatedTodo : prevTodo)));
        handleCount();
      })
      .catch(() => {
        handleError(Errors.updating);
      })
      .finally(() => callback());
  };

  const handleCompleteAll = (allTodos: Todo[], data: boolean) => {
    const updatedTodos = allTodos.map((todo) => ({
      ...todo,
      completed: data,
    }));

    Promise.all(
      updatedTodos.map((updatedTodo) => editTodo(updatedTodo.id, {
        completed: updatedTodo.completed,
      }).catch(() => {
        handleError(Errors.updating);
      })),
    )
      .then(() => {
        setTodos(updatedTodos);
        fetchData();
        handleCount();
      });
  };

  const handleDelete = (todo: Todo, callback?: () => void) => {
    deleteTodo(todo.id)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter(item => item !== todo));
        handleCount();
        if (todos.length === 1) {
          inputRef.current?.focus();
        }
      })
      .catch(() => {
        handleError(Errors.deleting);
        if (callback) {
          callback();
        }
      });
  };

  const handleAdd = () => {
    setIsSubmited(true);
    const createdTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    addTodo(createdTodo)
      .then((response) => {
        setTitle('');
        setCounter(prevCount => prevCount + 1);
        setTodos((prevTodos) => [...prevTodos, response] as Todo[]);
      })
      .catch(() => {
        handleError(Errors.adding);
      })
      .finally(() => {
        setTemporaryTodo(null);
        setIsSubmited(false);
      });
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      handleError(Errors.requiredTitle);

      return;
    }

    handleAdd();

    setTemporaryTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={() => {
                if (todos.every(todo => todo.completed === true)) {
                  handleCompleteAll(todos, false);
                } else {
                  handleCompleteAll(todos, true);
                }
              }}
            />
          )}
          <TodoForm
            handleSubmit={handleSubmit}
            title={title}
            isSubmited={isSubmited}
            setTitle={(e) => setTitle(e)}
          />
        </header>
        {(todos.length > 0 || temporaryTodo) && (
          <TodoList
            todos={todos}
            filter={filter}
            tempTodo={temporaryTodo}
            handleDeleteTodo={handleDelete}
            handleCompleteTodo={handleComplete}
            handleError={handleError}
          />
        )}
        {(todos.length > 0 || temporaryTodo) && (
          <TodoFooter
            counter={counter}
            filter={filter}
            setFilter={(f) => setFilter(f)}
            todos={todos}
            handleDelete={handleDelete}
          />
        )}
      </div>
      <TodoError error={error} onClose={() => setError(null)} />
    </div>
  );
};
