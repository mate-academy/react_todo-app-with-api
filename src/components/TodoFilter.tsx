import classNames from 'classnames';
import { FilterValue } from '../utils/FilterValue';

type Props = {
  setFilterValue: (filterValue: FilterValue) => void;
  filterValue: FilterValue;
};

export const TodoFilter = ({ setFilterValue, filterValue }: Props) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterValue === 'all',
        })}
        onClick={() => setFilterValue(FilterValue.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterValue === 'active',
        })}
        onClick={() => setFilterValue(FilterValue.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterValue === 'completed',
        })}
        onClick={() => setFilterValue(FilterValue.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
