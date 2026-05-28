import classNames from 'classnames';
import { Filters } from '../../types/Todo';

type FilterProps = {
  filterBy: Filters;
  onFilterChange: (filter: Filters) => void;
};

export function Filter({ filterBy, onFilterChange }: FilterProps) {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterBy === Filters.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(Filters.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterBy === Filters.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(Filters.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterBy === Filters.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(Filters.completed)}
      >
        Completed
      </a>
    </nav>
  );
}
