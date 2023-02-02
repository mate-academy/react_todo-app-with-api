import React, { memo } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FiltersType';

type Props = {
  activeTodos: number;
  completedFilter: FilterType;
  onChangeType: (str: FilterType) => void;
  completedTodos: boolean;
  onDeleteComplited: () => void;
};

export const Footer: React.FC<Props> = memo(({
  activeTodos,
  completedFilter,
  onChangeType,
  completedTodos,
  onDeleteComplited,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} item${activeTodos > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: completedFilter === FilterType.All,
          })}
          onClick={() => onChangeType(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: completedFilter === FilterType.Active,
          })}
          onClick={() => onChangeType(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: completedFilter === FilterType.Completed,
          })}
          onClick={() => onChangeType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !completedTodos,
        })}
        onClick={onDeleteComplited}
      >
        Clear completed
      </button>
    </footer>
  );
});
