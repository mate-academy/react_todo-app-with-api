import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  activeCount: number;
  filters: Filter[];
  filterBy: Filter;
  setFilterBy: (value: Filter) => void;
  hasCompleted: boolean;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  filters,
  filterBy,
  setFilterBy,
  hasCompleted,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter}
            href="#/"
            className={classNames('filter__link', {
              selected: filterBy === filter,
            })}
            data-cy={`FilterLink${filter}`}
            onClick={() => setFilterBy(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
