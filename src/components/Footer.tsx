import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  filter: FilterType;
  onFilter: (filter: FilterType) => void;
  isSomeCompleted: boolean;
  counterNotCompleted: number;
  loading: boolean;
  handleDeleteAllCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  onFilter,
  isSomeCompleted,
  counterNotCompleted,
  loading,
  handleDeleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counterNotCompleted} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(
          filterType =>
            typeof filterType === 'string' && (
              <a
                key={filterType}
                href="#/"
                className={classNames('filter__link', {
                  // eslint-disable-next-line prettier/prettier
                  'selected': filter === filterType,
                })}
                data-cy={`FilterLink${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
                onClick={() => onFilter(filterType)}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </a>
            ),
        )}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteAllCompleted}
        disabled={!isSomeCompleted || loading}
      >
        Clear completed
      </button>
    </footer>
  );
};
