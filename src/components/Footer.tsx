import { FC, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { SearchLink } from './SearchLink';

interface Props {
  itemsLeft: number;
  clearCompleted: () => void;
  completedTodosAmount: number;
}

export const Footer: FC<Props> = memo(({
  itemsLeft,
  clearCompleted,
  completedTodosAmount,
}) => {
  const [searchParams] = useSearchParams();
  const filterBy = searchParams.get('filterBy');

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <SearchLink
          data-cy="FilterLinkAll"
          params={{ filterBy: null }}
          className={cn('filter__link',
            { selected: filterBy === null })}
        >
          All
        </SearchLink>

        <SearchLink
          data-cy="FilterLinkActive"
          params={{ filterBy: 'active' }}
          className={cn('filter__link',
            { selected: filterBy === 'active' })}
        >
          Active
        </SearchLink>
        <SearchLink
          data-cy="FilterLinkCompleted"
          params={{ filterBy: 'completed' }}
          className={cn('filter__link',
            { selected: filterBy === 'completed' })}
        >
          Completed
        </SearchLink>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        style={{
          visibility: completedTodosAmount > 0
            ? 'visible'
            : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
});
