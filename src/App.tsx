/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { TContext, useTodoContext } from './context/TodoContext';
import { SortTypes, Todo } from './types/Todo';
// import { deleteTodo } from './api/todos';

const USER_ID = 11550;

export const App: React.FC = () => {
  const {
    todos,
    hasError,
    setHasError,
    sortType,
    setSortType,
    handleToggleAllStatus,
    setIsToggledAll,
    setIsGroupDeleting,
    handleDelete,
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

  const isAllCompleted = todos.every((todo) => todo.completed);

  const toggleAll = () => {
    if (isAllCompleted) {
      handleToggleAllStatus();
      setIsToggledAll(true);
      setTimeout(() => setIsToggledAll(false), 500);
    }
  };

  const deleteCompleted = () => {
    setIsGroupDeleting(true);

    const completedIds = sortedTodos.completed.map((todo) => todo.id);

    Promise.allSettled(completedIds.map((todoId) => handleDelete(todoId)));
    setTimeout(() => setIsGroupDeleting(false), 500);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {(todos.length > 0) && (
            <button
              type="button"
              className={cn('todoapp__toggle-all',
                {
                  active: (isAllCompleted),
                })}
              onClick={toggleAll}
              data-cy="ToggleAllButton"
            />
          )}
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
              disabled={!(todos.some(todo => todo.completed))}
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
