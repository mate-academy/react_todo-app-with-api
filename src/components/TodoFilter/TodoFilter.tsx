import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter;
  setFilter: (newFilter: Filter) => void;
};

export const TodosFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href={`#/${Filter.All}`}
        className={classNames('filter__link', {
          selected: filter === Filter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Filter.All)}
      >
        All
      </a>

      <a
        href={`#/${Filter.Active}`}
        className={classNames('filter__link', {
          selected: filter === Filter.Active,
        })}
        onClick={() => setFilter(Filter.Active)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href={`#/${Filter.Completed}`}
        className={classNames('filter__link', {
          selected: filter === Filter.Completed,
        })}
        onClick={() => setFilter(Filter.Completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
