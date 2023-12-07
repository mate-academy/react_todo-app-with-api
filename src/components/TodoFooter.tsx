import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Statuses';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

interface Props {
  todos: Todo[],
  filter: Status,
  setFilter: (value: Status) => void,
  clearCompleted: () => void,
  setErrorMessage: (message: Errors | '') => void,
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
  setErrorMessage,
}) => {
  const leftTodos = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = async () => {
    try {
      await clearCompleted();
    } catch (error) {
      setErrorMessage(Errors.DeleteTodoError);
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '70px',
      }}
      >
        <span className="todo-count" data-cy="TodosCounter">
          {`${leftTodos} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === Status.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setFilter(Status.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filter === Status.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => setFilter(Status.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filter === Status.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilter(Status.Completed)}
          >
            Completed
          </a>
        </nav>
      </div>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodos}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        {hasCompletedTodos && 'Clear completed'}
      </button>
    </footer>
  );
};
