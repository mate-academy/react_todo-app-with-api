/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { TodoItem } from './TodoItem';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Filter>(Filter.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const inputRef = React.useRef<HTMLInputElement>(null);
  const editInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (editId) {
      editInputRef.current?.focus();
    }
  }, [editId]);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  let visibleTodos = todos;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      title: normalizedTitle,
      completed: false,
      userId: 0,
    });

    setErrorMessage('');

    createTodo(normalizedTitle)
      .then(todo => {
        setTodos((prevTodos: Todo[]) => [...prevTodos, todo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => setTempTodo(null));
  };

  const handleSubmitEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = editTitle.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');

    updateTodo(editId, normalizedTitle)
      .then(todo => {
        setTodos((prevTodos: Todo[]) =>
          prevTodos.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return {
                ...prevTodo,
                title: todo.title,
              };
            }

            return prevTodo;
          }),
        );
        setTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setEditId(null);
        setEditTitle('');
      });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditTitle('');
  };

  const handleDeletingTodo = (id: number) => {
    setErrorMessage('');
    setProcessingIds(prevIds => [...prevIds, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() =>
        setProcessingIds(prevIds => prevIds.filter(prevId => prevId !== id)),
      );
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => handleDeletingTodo(todo.id));
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerID = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerID);
  }, [errorMessage]);

  if (status === Filter.active) {
    visibleTodos = activeTodos;
  } else if (status === Filter.completed) {
    visibleTodos = completedTodos;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={inputRef}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {todos.length === 0 ? null : (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDelete={() => handleDeletingTodo(todo.id)}
                  loading={processingIds.includes(todo.id)}
                  editInputRef={editInputRef}
                  setEditId={setEditId}
                  editId={editId}
                  setEditTitle={setEditTitle}
                  editTitle={editTitle}
                  handleSubmitEdit={handleSubmitEdit}
                  handleCancelEdit={handleCancelEdit}
                />
              ))}

              {tempTodo && <TodoItem todo={tempTodo} loading={true} />}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${activeTodos.length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  data-cy="FilterLinkAll"
                  onClick={() => setStatus(Filter.all)}
                  className={classNames('filter__link', {
                    selected: status === Filter.all,
                  })}
                >
                  All
                </a>

                <a
                  href="#/active"
                  data-cy="FilterLinkActive"
                  onClick={() => setStatus(Filter.active)}
                  className={classNames('filter__link', {
                    selected: status === Filter.active,
                  })}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  data-cy="FilterLinkCompleted"
                  onClick={() => setStatus(Filter.completed)}
                  className={classNames('filter__link', {
                    selected: status === Filter.completed,
                  })}
                >
                  Completed
                </a>
              </nav>

              {completedTodos.length > 0 && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={handleClearCompleted}
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
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
