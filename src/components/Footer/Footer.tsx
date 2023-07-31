import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types';

type Props = {
  activeCount: number,
  filter: Filter,
  setFilter: (filter: Filter) => void,
  isClearBtnShown: boolean,
  onClearAll: () => void,
};

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  setFilter,
  isClearBtnShown,
  onClearAll,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {isClearBtnShown && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={onClearAll}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
