import classNames from 'classnames';
import { useState, useEffect } from 'react';

type Props = {
  getListTodo: (filter?: TypeFilter) => void
};

export enum TypeFilter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const Filter: React.FC<Props> = ({ getListTodo }) => {
  const [typeFilter, setTypeFilter] = useState(TypeFilter.ALL);
  const filters = Object.values(TypeFilter);

  useEffect(() => {
    function typeFunc(type: TypeFilter) {
      switch (type) {
        case TypeFilter.ALL:
          getListTodo(TypeFilter.ALL);
          break;
        case TypeFilter.ACTIVE:
          getListTodo(TypeFilter.ACTIVE);
          break;
        case TypeFilter.COMPLETED:
          getListTodo(TypeFilter.COMPLETED);
          break;
        default:
          break;
      }
    }

    typeFunc(typeFilter);
  }, [typeFilter]);

  return (
    <nav className="filter">
      {filters.map((type) => (
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: typeFilter === type,
          })}
          onClick={() => setTypeFilter(type)}
        >
          {`${type.slice(0, 1).toUpperCase()}${type.slice(1)}`}
        </a>
      ))}
    </nav>
  );
};
