import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType;
  removeCompletedTodos: () => void;
  handleFiltering: (filter: FilterType) => void;
  isSomethingDone: boolean;
  activeTodosAmount: number;
};

export const Footer: React.FC<Props> = React.memo(({
  filterType,
  removeCompletedTodos,
  handleFiltering,
  isSomethingDone,
  activeTodosAmount,
}) => {
  const sortBy = (filter: FilterType) => {
    handleFiltering(filter);
  };

  const handleClearCompleted = () => {
    removeCompletedTodos();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodosAmount} items left`}</span>

      <nav className="filter">
        {Object.values(FilterType).map((filterLink) => (
          <a
            href={`#/${filterLink}`}
            className={classNames('filter__link', {
              selected: filterType === filterLink,
            })}
            onClick={() => sortBy(filterLink)}
          >
            {filterLink}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: isSomethingDone ? 'visible' : 'hidden' }}
        disabled={!isSomethingDone}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
