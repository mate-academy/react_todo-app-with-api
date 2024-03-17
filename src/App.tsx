/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { USER_ID, createTodos, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import TodoList from './Components/TodoList/TodoList';

enum FilterTypes {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

function prepareGoods(todos: Todo[], filteringType: FilterTypes): Todo[] {
  const allTodos = [...todos];

  switch (filteringType) {
    case FilterTypes.Active:
      return allTodos.filter(todo => todo.completed === false);
    case FilterTypes.Completed:
      return allTodos.filter(todo => todo.completed === true);
    default:
      return allTodos;
  }
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [filteringType, setFilteringType] = useState<FilterTypes>(
    FilterTypes.All,
  );
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [value, setValue] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setdeletingId] = useState<number | null>(null);
  const completedTodos = todos.filter(todo => todo.completed);
  const unCompletedTodos = todos.filter(todo => !todo.completed);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const activeTodosLength = todos.length - completedTodos.length;
  const allCompletedTodos = todos.length - unCompletedTodos.length;

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  function getAllTodos() {
    getTodos()
      .then(receivedTodos => {
        setTodos(receivedTodos);
      })
      .catch(() => {
        setErrorMessage(`Unable to load todos`);
      });
  }

  useEffect(() => {
    if (USER_ID) {
      getAllTodos();
    }
  }, []);

  useEffect(() => {
    setFilteredTodos(prepareGoods(todos, filteringType));
  }, [todos, filteringType]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage]);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  function deleteSingleTodo(id: number): Promise<void> {
    setdeletingId(id);

    return deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setdeletingId(null);
        focusInput();
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setdeletingId(null);
        focusInput();
      });
  }

  function addTodo(): Promise<void> {
    setErrorMessage('');

    if (!value.trim()) {
      setErrorMessage('Title should not be empty');

      return Promise.reject();
    }

    setTempTodo({ id: 0, completed: false, title: value, userId: USER_ID });

    return createTodos({ userId: USER_ID, title: value, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
        focusInput();
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        setTempTodo(null);
        focusInput();
        throw error;
      });
  }

  const handleAddingTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!value.trim()) {
      setErrorMessage('Title should not be empty');
      setIsSubmitting(false);
      inputRef.current?.focus();

      return;
    }

    addTodo()
      .then(() => setValue(''))
      .finally(() => setIsSubmitting(false));
  };

  const handleFiltering = (type: FilterTypes) => {
    setFilteringType(type);
  };

  const clearCompletedTodo = () => {
    completedTodos.map(todo => deleteSingleTodo(todo.id));
    focusInput();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: allCompletedTodos,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              disabled={isSubmitting}
              data-cy="NewTodoField"
              type="text"
              value={value}
              onChange={handleAddingTodo}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        <TodoList
          focusInput={focusInput}
          todos={filteredTodos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          deletingId={deletingId}
          // setTempTodo={setTempTodo}
          // errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
          deleteSingleTodo={deleteSingleTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosLength} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filteringType === 'all',
                })}
                data-cy="FilterLinkAll"
                onClick={() => handleFiltering(FilterTypes.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filteringType === 'active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => handleFiltering(FilterTypes.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filteringType === 'completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => handleFiltering(FilterTypes.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.length === unCompletedTodos.length}
              onClick={() => clearCompletedTodo()}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    </div>
  );
};
