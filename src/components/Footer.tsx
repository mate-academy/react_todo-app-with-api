import classNames from 'classnames';
import React from 'react';
import { FilterTypes } from '../types/Filter';
import { Maybe } from '../types/Maybe';

interface Props {
  itemsLeft: Maybe<number>;
  filterType: FilterTypes;
  onFilterTypeChange: (type: FilterTypes) => void;
}

export const Footer: React.FC<Props> = React.memo((props) => {
  const { itemsLeft, filterType, onFilterTypeChange } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterTypes.All },
          )}
          onClick={() => onFilterTypeChange(FilterTypes.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterTypes.Active },
          )}
          onClick={() => onFilterTypeChange(FilterTypes.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterTypes.Completed },
          )}
          onClick={() => onFilterTypeChange(FilterTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
      >
        Clear completed
      </button>
    </footer>
  );
});
