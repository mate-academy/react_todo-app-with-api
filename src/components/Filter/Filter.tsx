import React from 'react';
import classnames from 'classnames';
import { Status } from '../../types/Status';

interface FilterProps {
  currentFilterStatus: Status;
  onFilter: (status: Status) => void;
}

export const Filter: React.FC<FilterProps> = ({
  currentFilterStatus,
  onFilter,
}) => {
  const valuesOfStatus = Object.values(Status);

  function checkField(field: Status) {
    return field === currentFilterStatus;
  }

  return (
    <nav className="filter" data-cy="Filter">
      {valuesOfStatus.map(field => (
        <a
          key={field}
          onClick={() => onFilter(field)}
          href="#/"
          className={classnames('filter__link', {
            selected: checkField(field),
          })}
          data-cy={`FilterLink${field}`}
        >
          {field}
        </a>
      ))}
    </nav>
  );
};
