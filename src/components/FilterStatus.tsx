import cn from 'classnames';
import { FilterBy } from '../types/FilterBy';

interface Props {
  filterStatus: FilterBy;
  handleFilterChange: (status: FilterBy) => void;
}

export const Filter: React.FC<Props> = ({
  filterStatus,
  handleFilterChange,
}) => (
  <nav className="filter" data-cy="Filter">
    {(Object.values(FilterBy) as FilterBy[]).map(status => (
      <a
        key={status}
        href={`#/${status.toLowerCase()}`}
        className={cn('filter__link', { selected: filterStatus === status })}
        data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
        onClick={event => {
          event.preventDefault();
          handleFilterChange(status);
        }}
      >
        {status}
      </a>
    ))}
  </nav>
);

export default Filter;
