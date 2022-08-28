import React from 'react';
import cn from 'classnames';

interface Props {
  itemsLeft: number;
  filterBy: string;
  setFilterBy: (mask: string) => void;
  clearCompleted: () => void,
  isSomeCompleted: boolean,
}

export const TodosFooter: React.FC<Props> = React.memo(({
  itemsLeft,
  filterBy,
  setFilterBy,
  clearCompleted,
  isSomeCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', { selected: filterBy === 'all' })}
          onClick={() => setFilterBy('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', { selected: filterBy === 'active' })}
          onClick={() => setFilterBy('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', { selected: filterBy === 'completed' })}
          onClick={() => setFilterBy('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        style={{ visibility: isSomeCompleted ? 'hidden' : 'visible' }}
      >
        Clear completed
      </button>

    </footer>
  );
});
