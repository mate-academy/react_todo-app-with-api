import cn from 'classnames';

import { useContext } from 'react';
import { Filter } from '../types/Filter';
import { TodoContext } from '../providers/TodoProvider';

const filters: Filter[] = [
  Filter.All,
  Filter.Active,
  Filter.Completed,
];

export const Filters = () => {
  const {
    filter,
    setFilter,
  } = useContext(TodoContext);

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(filterType => (
        <a
          key={filterType}
          href={`#/${filter !== Filter.All
            ? filter.toLowerCase()
            : ''}`}
          className={cn(
            'filter__link',
            {
              selected: filter === filterType,
            },
          )}
          data-cy={`FilterLink${filterType}`}
          onClick={() => setFilter(filterType)}
        >
          {filterType}
        </a>
      ))}
    </nav>
  );
};
