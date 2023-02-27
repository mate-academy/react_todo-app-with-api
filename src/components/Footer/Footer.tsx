import React from 'react';
import classNames from 'classnames';
import { FilterByStatus } from '../../types/FilterByStatus';

type Props = {
  activeTodosQuantity: number;
  completedTodosQuantity: number;
  filteredByStatus: FilterByStatus;
  setFilteredByStatus: (newFilter: FilterByStatus) => void;
  onClearCompleted: () => void;
};

const filteredItems = Object.values(FilterByStatus);

export const Footer: React.FC<Props> = React.memo(({
  activeTodosQuantity,
  completedTodosQuantity,
  filteredByStatus,
  setFilteredByStatus,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosQuantity} items left`}
      </span>

      <nav className="filter">
        {filteredItems.map((item) => (
          <a
            key={item}
            href={`#/${item}`}
            className={classNames('filter__link', {
              selected: item === filteredByStatus,
            })}
            onClick={() => setFilteredByStatus(item)}
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: completedTodosQuantity ? 'visible' : 'hidden' }}
        disabled={!completedTodosQuantity}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
