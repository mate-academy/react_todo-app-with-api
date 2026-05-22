import cn from 'classnames';
import { FilterStatusValues } from '../../utils/filterStatusValues';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ filterStatus, setFilterStatus }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterStatus === FilterStatusValues.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterStatus(FilterStatusValues.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterStatus === FilterStatusValues.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterStatus(FilterStatusValues.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterStatus === FilterStatusValues.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterStatus(FilterStatusValues.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
