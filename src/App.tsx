import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './utils/UserWarning';
import { createTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import { Status } from './types/Status';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodoFilter';

const USER_ID = 11408;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [value, setValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const allTodosCompleted = useMemo(
    () => todos.every((todo: Todo) => todo.completed),
    [todos],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, errorMessage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage(
        '',
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setErrorMessage('');

    if (!value.trim()) {
      setErrorMessage('Title should not be empty');
    } else {
      setTempTodo({
        userId: USER_ID, title: value.trim(), completed: false, id: 0,
      });

      createTodo({ userId: USER_ID, title: value.trim(), completed: false })
        .then(newItem => {
          setTodos(currentTodos => [...currentTodos, newItem]);
          setValue('');
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const handleToggleAll = () => {
    const promiseArray = todos.map(
      todo => updateTodo(todo.id, { completed: !allTodosCompleted }),
    );

    Promise.all(promiseArray)
      .then(() => {
        setTodos(prevTodos => prevTodos.map(
          item => ({ ...item, completed: !allTodosCompleted }),
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to change status, refresh page');
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames(
              'todoapp__toggle-all',
              {
                active: allTodosCompleted,
              },
            )}
            data-cy="ToggleAllButton"
            aria-label="toggle all"
            onClick={handleToggleAll}
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              ref={inputRef}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList
            todos={todos}
            status={status}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
          />
          {tempTodo && (
            <div
              data-cy="Todo"
              className="todo"
            >
              <label
                className="todo__status-label"
              >
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                />
              </label>

              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                aria-label="Delete"
              >
                ×
              </button>

              <div
                data-cy="TodoLoader"
                className="modal overlay is-active"
              >
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>

            </div>
          )}
        </section>

        {!!todos.length && (
          <TodosFilter
            todos={todos}
            setTodos={setTodos}
            status={status}
            setStatus={setStatus}
            setErrorMessage={setErrorMessage}
          />
        )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          aria-label="Hide Error"
          onClick={() => setErrorMessage(
            '',
          )}
        />
        {errorMessage}
      </div>
    </div>
  );
};
