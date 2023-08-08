import cn from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  status: FilterType,
  setStatus: (filter: FilterType) => void,
};

export const TodoFilter: React.FC<Props> = ({ status, setStatus }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: status === FilterType.All,
        })}
        onClick={() => setStatus(FilterType.All)}
      >
        {FilterType.All}
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: status === FilterType.Active,
        })}
        onClick={() => setStatus(FilterType.Active)}
      >
        {FilterType.Active}
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: status === FilterType.Completed,
        })}
        onClick={() => setStatus(FilterType.Completed)}
      >
        {FilterType.Completed}
      </a>
    </nav>
  );
};
