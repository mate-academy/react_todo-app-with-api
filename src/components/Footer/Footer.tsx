import { useState } from 'react';
import classNames from 'classnames';

type Props = {
  left: number;
  completed: number;
  onFilter: (type: string) => void;
  onClearCompleted: ()=>void;
};

enum Filter {
  ALL,
  ACTIVE,
  COMPLETED,
}

export const Footer: React.FC<Props> = ({
  left, onFilter, completed, onClearCompleted,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(Filter.ALL);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${left} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link', { selected: selectedFilter === Filter.ALL },
          )}
          onClick={() => {
            onFilter('ALL');
            setSelectedFilter(Filter.ALL);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link', { selected: selectedFilter === Filter.ACTIVE },
          )}
          onClick={() => {
            onFilter('ACTIVE');
            setSelectedFilter(Filter.ACTIVE);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link', { selected: selectedFilter === Filter.COMPLETED },
          )}
          onClick={() => {
            onFilter('COMPLETED');
            setSelectedFilter(Filter.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>
      <div>
        {completed !== 0 && (
          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            onClick={onClearCompleted}
          >
            Clear completed
          </button>
        )}
      </div>
    </footer>
  );
};
