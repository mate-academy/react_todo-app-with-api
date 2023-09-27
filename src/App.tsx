/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { TContext, useTodoContext } from './context/TodoContext';
import { SortTypes, Todo } from './types/Todo';
import { deleteTodo, getTodos } from './api/todos';

const USER_ID = 11550;

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    hasError,
    setHasError,
    handleError,
    sortType,
    setSortType,
    handleToggleAllStatus,
    setIsToggledAll,
    setIsGroupDeleting,
    titleInputRef,
  } = useTodoContext() as TContext;

  const handleSorting = (type: SortTypes) => setSortType(type);

  const sortedTodos: {
    all: Todo[];
    completed: Todo[];
    active: Todo[];
  } = {
    all: todos || [],
    completed: (todos || []).filter((todo: Todo) => todo.completed),
    active: (todos || []).filter((todo: Todo) => !todo.completed),
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isAllCompleted = todos.every((todo) => todo.completed === true);
  const isAllNotCompleted = todos.every((todo) => todo.completed === false);

  const toggleAll = () => {
    if (isAllCompleted) {
      handleToggleAllStatus();
      setIsToggledAll(true);
      setTimeout(() => setIsToggledAll(false), 500);
    }

    if (isAllNotCompleted) {
      handleToggleAllStatus();
      setIsToggledAll(true);
      setTimeout(() => setIsToggledAll(false), 500);
    }
  };

  const arrayCompleted = [...todos].filter((todo) => todo.completed === true);

  const deleteCompleted = () => {
    setIsGroupDeleting(true);

    const completedIds = arrayCompleted.map((todo) => todo.id);

    setTodos((prevTodos) => prevTodos
      .filter((todo) => !completedIds.includes(todo.id)));

    Promise.all(completedIds.map((todoId) => deleteTodo(todoId)))
      .catch(() => {
        handleError('Unable to delete a todo');
      })
      .finally(() => {
        setIsGroupDeleting(false);
        titleInputRef.current?.focus();

        getTodos(USER_ID)
          .then((res) => {
            setTodos(res);
          });
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all',
              {
                // eslint-disable-next-line quote-props
                'active': (isAllCompleted || isAllNotCompleted),
              })}
            onClick={toggleAll}
            data-cy="ToggleAllButton"
          />
          <TodoForm />
        </header>

        <TodoList todos={sortedTodos[sortType]} />

        {(todos.length > 0) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${sortedTodos.active.length} items left`}
            </span>
            <TodoFilter sortType={sortType} handleSort={handleSorting} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={deleteCompleted}
              disabled={!(todos.some(todo => todo.completed === true))}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${hasError === null ? 'hidden' : ''}`}
      >

        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHasError(null)}
        />
        {hasError}

      </div>
    </div>
  );
};
