/* eslint-disable max-len, jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './TodoItem';

type Status = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [title, setTitle] = React.useState('');
  const [status, setStatus] = React.useState<Status>('all');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos().then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return () => {};
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setLoading(true);

    setLoading(true);

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: 0,
    });

    createTodo(normalizedTitle)
      .then(todo => {
        setTodos(current => [...current, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        inputRef.current?.focus();
      })
      .finally(() => setLoading(false));
  }

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  let visibleTodos = todos;

  if (status === 'active') {
    visibleTodos = activeTodos;
  } else if (status === 'completed') {
    visibleTodos = completedTodos;
  }

  // Додамо функцію для зміни статусу задачі
  const handleToggleStatus = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  // Додамо функцію для зміни статусу всіх задач
  const handleToggleAllStatus = () => {
    const areAllCompleted = todos.every(todo => todo.completed);
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={classNames('todoapp__toggle-all', { active: todos.length > 0 && todos.every(todo => todo.completed) })}
            data-cy="ToggleAllButton"
            onClick={handleToggleAllStatus}
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              name="title"
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={inputRef}
              disabled={loading}
            />
          </form>
        </header>

        {/* Hide the footer if there are no todos */}
        {todos.length === 0 ? null : (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={() => {}}
                />
              ))}

              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  loading
                  onDelete={() => {}}
                  onToggleStatus={handleToggleStatus}
                />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodos.length}
                {' '}
                items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  data-cy="FilterLinkAll"
                  onClick={() => setStatus('all')}
                  className={classNames('filter__link', {
                    selected: status === 'all',
                  })}
                >
                  All
                </a>

                <a
                  href="#/active"
                  data-cy="FilterLinkActive"
                  onClick={() => setStatus('active')}
                  className={classNames('filter__link', {
                    selected: status === 'active',
                  })}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  data-cy="FilterLinkCompleted"
                  onClick={() => setStatus('completed')}
                  className={classNames('filter__link', {
                    selected: status === 'completed',
                  })}
                >
                  Completed
                </a>
              </nav>

              {completedTodos.length === 0 ? null : (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames('notification is-danger is-light has-text-weight-normal', {
          hidden: !errorMessage,
        })}
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
