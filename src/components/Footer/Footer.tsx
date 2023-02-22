import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosAmount: number;
  filterByStatus: FilterStatus;
  isDone: boolean;
  setFilterByStatus: (newFilter: FilterStatus) => void;
  onClearCompleted: () => void;
};

const filterOptions = Object.values(FilterStatus);

export const Footer: React.FC<Props> = React.memo(({
  activeTodosAmount,
  filterByStatus,
  isDone,
  setFilterByStatus,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodosAmount} items left`}</span>

      <nav className="filter">
        {filterOptions.map((option) => (
          <a
            key={option}
            href={`#/${option}`}
            className={classNames('filter__link', {
              selected: option === filterByStatus,
            })}
            onClick={() => setFilterByStatus(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: isDone ? 'visible' : 'hidden' }}
        disabled={!isDone}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
