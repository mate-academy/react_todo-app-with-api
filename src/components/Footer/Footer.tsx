import classNames from 'classnames';
import React, { useCallback } from 'react';
import { FilterType } from '../../types/FilterType';
import { filterHrefByType, filterTypeList } from '../../utils/constans';

type Props = {
  filterType: FilterType
  setFilterType: (status: FilterType) => void
  completedTodos: number
  todosLength: number
  onRemove: () => Promise<void>
};

export const Footer: React.FC<Props> = React.memo(({
  filterType,
  setFilterType,
  completedTodos,
  onRemove,
  todosLength,
}) => {
  const uncompletedCount = todosLength - completedTodos;

  const handleFilterType = useCallback((status: FilterType) => {
    setFilterType(status);
  }, []);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {uncompletedCount <= 1 ? (
          `${uncompletedCount} item left`
        ) : (
          `${uncompletedCount} items left`
        )}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterTypeList.map(status => (
          <a
            data-cy="FilterLinkAll"
            href={filterHrefByType[status]}
            key={status}
            className={classNames('filter__link', {
              selected: filterType === status,
            })}
            onClick={() => handleFilterType(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: completedTodos <= 0,
        })}
        onClick={onRemove}
      >
        Clear completed
      </button>
    </footer>
  );
});
