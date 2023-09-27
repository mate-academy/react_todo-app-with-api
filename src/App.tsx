/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-param-reassign */

import React, {
  FormEventHandler, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  addTodo, updateTodo, deleteTodo, getTodos,
} from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMess } from './types/Error';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { NewTodoInput } from './components/NewTodoInput';

const USER_ID = 10521;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMess>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [title, setTitle] = useState<string>('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleError = (mess: ErrorMess) => {
    setError(mess);
    setTimeout(() => setError(null), 3000);
  };

  useEffect(() => {
    if (!isSubmiting) {
      inputRef.current?.focus();
    }
  }, [isSubmiting]);

  const fetchData = async () => {
    try {
      const todoss = getTodos(USER_ID);
      const count = (await todoss).filter(todo => todo.completed === false)
        .length;

      setTodos(await todoss);
      setCounter(count);
    } catch (e) {
      handleError('Unable to load todos');
    }
  };

  const handleComplete = (todo: Todo, callback: () => void) => {
    updateTodo(todo.id, {
      completed: !todo.completed,
    }).then(() => {
      todo.completed = !todo.completed;
      const count = todos.filter(toDo => toDo.completed === false)
        .length;

      setCounter(count);
    }).catch(() => {
      handleError('Unable to update a todo');
    }).finally(() => callback());
  };

  const handleCompleteALL = (toDos: Todo[], data: boolean) => {
    toDos.forEach(todo => {
      if (data === true && todo.completed === false) {
        updateTodo(todo.id, {
          completed: data,
        }).catch(() => {
          handleError('Unable to update a todo');
        }).finally(() => {
          fetchData();
          const count = todos.filter(toDo => toDo.completed === false)
            .length;

          setCounter(count);
        });
      } else if (data === false) {
        updateTodo(todo.id, {
          completed: data,
        }).catch(() => {
          handleError('Unable to update a todo');
        }).finally(() => {
          fetchData();
          const count = todos.filter(toDo => toDo.completed === false)
            .length;

          setCounter(count);
        });
      }
    });
  };

  const handleDelete = (todo: Todo, callback?: () => void) => {
    deleteTodo(todo.id).then(() => {
      setTodos(prevTodo => prevTodo.filter(toDo => toDo !== todo));
      inputRef.current?.focus();
      setCounter(oldCount => oldCount - 1);
    }).catch(() => {
      handleError('Unable to delete todo');
      if (callback) {
        callback();
      }
    });
  };

  const handleAdd = () => {
    setIsSubmiting(true);
    addTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    }).then((response) => {
      setTitle('');
      setCounter(oldCount => oldCount + 1);
      setTodos((prevTodos) => [...prevTodos, response] as Todo[]);
    }).catch(() => {
      handleError('Unable to add a todo');
    }).finally(() => {
      setTemporaryTodo(null);
      setIsSubmiting(false);
    });
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (title.trim() === '') {
      handleError('Title should not be empty');

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
          {/* this buttons is active only if there are some active todos */}
          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all',
                { active: todos.every(todo => todo.completed) })}
              data-cy="ToggleAllButton"
              onClick={() => {
                if (todos.every(todo => todo.completed === true)) {
                  handleCompleteALL(todos, false);
                } else {
                  handleCompleteALL(todos, true);
                }
              }}
            />
          )}

          {/* Add a todo on form submit */}
          <NewTodoInput
            handleSubmit={handleSubmit}
            title={title}
            isSubmiting={isSubmiting}
            setTitle={(e) => setTitle(e)}
            inputRef={inputRef}
          />
        </header>

        {(todos.length > 0 || temporaryTodo) && (
          <TodoList
            todos={todos}
            filter={filter}
            temporaryTodo={temporaryTodo}
            handleDelete={handleDelete}
            handleComplete={handleComplete}
            handleError={handleError}
          />
        )}

        {/* Hide the footer if there are no todos */}
        {(todos.length > 0 || temporaryTodo)
          && (
            <Footer
              counter={counter}
              filter={filter}
              setFilter={(f) => setFilter(f)}
              todos={todos}
              handleDelete={handleDelete}
            />
          )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          { hidden: error === null })}
      >
        {error
        && (
          <div
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => setError(null)}
            />
          </div>

        )}
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
