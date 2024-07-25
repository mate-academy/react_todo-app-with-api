import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filterStatus: Filter;
  setFilterStatus: (param: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
}) => {
  const handleFilter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const text = event.currentTarget.textContent;

    setFilterStatus(text as Filter);
  };

  const filterParams = Object.values(Filter);

  return (
    <nav className="filter" data-cy="Filter">
      {filterParams.map(param => {
        return (
          <a
            key={param}
            href={`#/${param.toLocaleLowerCase()}`}
            className={cn('filter__link', {
              selected: filterStatus === param,
            })}
            data-cy={`FilterLink${param}`}
            onClick={handleFilter}
          >
            {param}
          </a>
        );
      })}
    </nav>
  );
};
