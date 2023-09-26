/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-useless-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
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

const USER_ID = 10521;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMess>(null);
  const [filter, setFilter] = useState<Filter>('All');
  const [title, setTitle] = useState<string>('');
  const [temporaryTodo, setTemporaryTodo] = useState<Todo | null>(null);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);

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

      setTodos(await todoss);
    } catch (e) {
      handleError('Unable to load todos');
    }
  };

  const handleComplete = (todo: Todo, callback: () => void) => {
    updateTodo(todo.id, {
      completed: !todo.completed,
    }).then(() => {
      fetchData();
    }).catch(() => {
      handleError('Unable to update a todo');
    }).finally(() => callback());
  };

  const handleCompleteALL = (toDos: Todo[], data: boolean) => {
    toDos.forEach(todo => {
      updateTodo(todo.id, {
        completed: data,
      }).catch(() => {
        handleError('Unable to update a todo');
      }).finally(() => {
        fetchData();
      });
    });
  };

  const handleDelete = (todo: Todo) => {
    deleteTodo(todo.id).catch(() => {
      handleError('Unable to delete todo');
    }).then(() => {
      fetchData();
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
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              disabled={isSubmiting}
              ref={inputRef}
            />
          </form>
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
        {(todos.length > 0 || temporaryTodo) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(todo => todo.completed === false).length} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', { selected: filter === 'All' })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link',
                  { selected: filter === 'Active' })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link',
                  { selected: filter === 'Completed' })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={() => todos.forEach(todo => {
                if (todo.completed) {
                  handleDelete(todo);
                }
              })}
            >
              Clear completed
            </button>
          </footer>
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
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError(null)}
          />
        )}
        {/* show only one message at a time */}
        {error}
      </div>
    </div>
  );
};
