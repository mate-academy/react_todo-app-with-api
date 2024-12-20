import cn from 'classnames';
import { Status } from '../../types/Status';

interface Props {
  statusFilter: string;
  setStatusFilter: (newFilter: Status) => void;
}

export const FilterTodos: React.FC<Props> = ({
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(status => {
        const capitalizedStatusValue = `${status.substring(0, 1).toUpperCase()}${status.substring(1)}`;

        return (
          <a
            href={status === 'all' ? '#/' : `#/${status}`}
            //Active link has the 'selected' class
            className={cn('filter__link', {
              selected: statusFilter === status,
            })}
            data-cy={`FilterLink${capitalizedStatusValue}`}
            onClick={() => setStatusFilter(status)}
            key={status}
          >
            {capitalizedStatusValue}
          </a>
        );
      })}
    </nav>
  );
};
