import classNames from 'classnames';
import { FilterBy } from '../../types/FilterBy';

interface Props {
  setQuery: (param: FilterBy) => void,
  query: FilterBy,
}

export const Filter: React.FC<Props> = ({ setQuery, query }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={
          classNames(
            'filter__link',
            { selected: query === FilterBy.All },
          )
        }
        data-cy="FilterLinkAll"
        onClick={() => setQuery(FilterBy.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={
          classNames(
            'filter__link',
            { selected: query === FilterBy.Active },
          )
        }
        data-cy="FilterLinkActive"
        onClick={() => setQuery(FilterBy.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={
          classNames(
            'filter__link',
            { selected: query === FilterBy.Completed },
          )
        }
        data-cy="FilterLinkCompleted"
        onClick={() => setQuery(FilterBy.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
