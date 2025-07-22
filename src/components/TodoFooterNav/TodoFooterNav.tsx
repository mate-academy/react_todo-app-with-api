import cn from 'classnames';
import { FilterParams, FilterValue } from '../../types/FilterParams';

type TodoFooterNavProps = {
  filterParam: FilterValue;
  setFilterParam: React.Dispatch<React.SetStateAction<FilterParams>>;
};

export const TodoFooterNav = ({
  filterParam,
  setFilterParam,
}: TodoFooterNavProps) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(FilterParams).map(([key, value]) => {
        return (
          <a
            key={value}
            href={`#/${value}`}
            className={cn('filter__link', {
              selected: filterParam === value,
            })}
            data-cy={`FilterLink${key}`}
            onClick={() => setFilterParam(value)}
          >
            {key}
          </a>
        );
      })}
    </nav>
  );
};
