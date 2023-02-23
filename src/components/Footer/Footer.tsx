import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosQuantity: number;
  filterByStatus: FilterStatus;
  isTodosDone: boolean;
  setFilterByStatus: (newFilter: FilterStatus) => void;
  onClearCompleted: () => void;
};

const filterOptions = Object.values(FilterStatus);

export const Footer: React.FC<Props> = React.memo(({
  activeTodosQuantity,
  filterByStatus,
  isTodosDone,
  setFilterByStatus,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodosQuantity} items left`}</span>

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
        style={{ visibility: isTodosDone ? 'visible' : 'hidden' }}
        disabled={!isTodosDone}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
