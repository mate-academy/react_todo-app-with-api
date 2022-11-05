import classNames from 'classnames';
import { useCallback } from 'react';

import { Sorting } from '../../types/Sorting';

type Props = {
  sortBy: Sorting,
  setSortBy: (sort: Sorting) => void,
  todosCount: number,
  onRemove: () => void,
  complitedTodos: number[],
};

export const Footer: React.FC<Props> = ({
  sortBy,
  setSortBy,
  todosCount,
  onRemove,
  complitedTodos,
}) => {
  const handleRemoveCompleted = useCallback(() => onRemove(), [complitedTodos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: sortBy === Sorting.All },
          )}
          onClick={() => setSortBy(Sorting.All)}
        >
          {Sorting.All}
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: sortBy === Sorting.Active },
          )}
          onClick={() => setSortBy(Sorting.Active)}
        >
          {Sorting.Active}
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: sortBy === Sorting.Completed },
          )}
          onClick={() => setSortBy(Sorting.Completed)}
        >
          {Sorting.Completed}
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed_disabled': !complitedTodos.length },
        )}
        onClick={handleRemoveCompleted}
        disabled={!complitedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
