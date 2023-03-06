import classNames from 'classnames';
import { useState } from 'react';

type Props = {
  setFilter: (type?: string) => void
};

enum TypeFilter {
  'All' = 'All',
  'Active' = 'active',
  'Completed' = 'completed',
}

export const Filter: React.FC<Props> = ({ setFilter }) => {
  const [typeFilter, setTypeFilter] = useState(TypeFilter.All);

  const chooseFilter = (type: TypeFilter) => {
    setFilter(type);
    setTypeFilter(type);
    localStorage.setItem('filter', type);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: typeFilter === TypeFilter.All,
        })}
        onClick={() => chooseFilter(TypeFilter.All)}
      >
        {TypeFilter.All}
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: typeFilter === TypeFilter.Active,
        })}
        onClick={() => chooseFilter(TypeFilter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: typeFilter === TypeFilter.Completed,
        })}
        onClick={() => chooseFilter(TypeFilter.Completed)}
      >
        Completed
      </a>
    </nav>

  );
};
