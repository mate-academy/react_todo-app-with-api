import React from 'react';
import { StatusFilter } from '../../types/TodoStatus';
import classNames from 'classnames';

type Props = {
  quantityActiveItems: number;
  onStatusFilter: (status: StatusFilter) => void;
  isActive: boolean;
  statusFilter: StatusFilter;
  onDeleteActive: () => void;
};

export const Footer: React.FC<Props> = ({
  quantityActiveItems,
  onStatusFilter,
  isActive,
  statusFilter,
  onDeleteActive,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {quantityActiveItems} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(StatusFilter).map((item, index) => (
          <a
            key={index}
            href="#/"
            className={classNames('filter__link', {
              selected: statusFilter === item,
            })}
            data-cy={`FilterLink${item}`}
            onClick={() => onStatusFilter(item)}
          >
            {item}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isActive}
        onClick={onDeleteActive}
      >
        Clear completed
      </button>
    </footer>
  );
};
