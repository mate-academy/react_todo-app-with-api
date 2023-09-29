import React from 'react';
import classNames from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  activeFilter: Status,
  setActiveFilter: (value: Status) => void,
};

export const Filter: React.FC<Props> = ({ activeFilter, setActiveFilter }) => {
  const isItActiveFilter = (filter: Status) => activeFilter === filter;

  const handleClick = (filter: Status) => {
    if (filter !== activeFilter) {
      setActiveFilter(filter);
    }
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: isItActiveFilter(Status.All),
        })}
        onClick={() => handleClick(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: isItActiveFilter(Status.Active),
        })}
        onClick={() => handleClick(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: isItActiveFilter(Status.Completed),
        })}
        onClick={() => handleClick(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
