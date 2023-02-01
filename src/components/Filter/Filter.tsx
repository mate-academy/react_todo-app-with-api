import cn from 'classnames';
import { FilterStatus } from '../../types/Filter';
import { FilterStates } from './FilterStates';

type Props = {
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>,
  filterStatus: string,
};

export const Filter: React.FC<Props> = ({ setFilterStatus, filterStatus }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={cn(
          'filter__link',
          { selected: filterStatus === FilterStates.All },
        )}
        onClick={() => setFilterStatus(FilterStates.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={cn(
          'filter__link',
          { selected: filterStatus === FilterStates.Active },
        )}
        onClick={() => setFilterStatus(FilterStates.Active)}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={cn('filter__link', {
          selected: filterStatus === FilterStates.Completed,
        })}
        onClick={() => setFilterStatus(FilterStates.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
