import React, { Fragment, memo } from 'react';
import cn from 'classnames';
import { StatusFilter } from '../../types/StatusFilter';
import './TodoFilter.scss';

interface TodoFilterProps {
  statusFilter: StatusFilter;
  onFilter: (filterBy: StatusFilter) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = memo(({
  statusFilter,
  onFilter,
}) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    filterByStatus: StatusFilter,
  ) => {
    event.preventDefault();

    onFilter(filterByStatus);
  };

  const filterStatuses = Object
    .keys(StatusFilter) as (keyof typeof StatusFilter)[];

  return (
    <nav className="filter">
      {filterStatuses.map(status => (
        <Fragment key={status}>
          <a
            href={status !== 'all' ? `#/${status}` : '#/'}
            className={cn('filter__link', {
              selected: status === statusFilter,
            })}
            onClick={event => handleFilterClick(event, StatusFilter[status])}
          >
            {status}
          </a>
        </Fragment>
      ))}
    </nav>
  );
});
