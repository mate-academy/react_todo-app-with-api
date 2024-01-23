import React from 'react';
import classNames from 'classnames';
import { TodosFilter } from '../../types/TodoFilter';

type Props = {
  filter: TodosFilter,
  setFilter: (filter: TodosFilter) => void,
  activeTodosCount: number,
  hasCompletedTodosCount: number,
  handleClearCompleted: () => void;
};
export const TodoFilter: React.FC<Props> = ({
  filter,
  setFilter,
  activeTodosCount,
  hasCompletedTodosCount,
  handleClearCompleted,
}) => {
  const itemText = activeTodosCount === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${itemText} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === TodosFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(TodosFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === TodosFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(TodosFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === TodosFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(TodosFilter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodosCount}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
