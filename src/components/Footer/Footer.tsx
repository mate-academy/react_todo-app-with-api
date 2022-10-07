import React, { Dispatch, SetStateAction } from 'react';
import classNames from 'classnames';
import { FilterValues } from '../../types/FilterValues';

type Props = {
  activeTodosTotal: number,
  isLeftCompletedTodos: boolean,
  filterValue: string,
  setFilterValue: Dispatch<SetStateAction<FilterValues>>,
  completedTodosIds: number[],
  onDelete: (id: number[]) => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosTotal,
  isLeftCompletedTodos,
  filterValue,
  setFilterValue,
  completedTodosIds,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosTotal} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterValue === 'all' },
          )}
          onClick={() => setFilterValue(FilterValues.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterValue === 'active' },
          )}
          onClick={() => setFilterValue(FilterValues.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterValue === 'completed' },
          )}
          onClick={() => setFilterValue(FilterValues.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => onDelete(completedTodosIds)}
        disabled={!isLeftCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
