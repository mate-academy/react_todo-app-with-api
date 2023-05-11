import { useState } from 'react';
import classNames from 'classnames';
import { FILTERS } from '../../../constants/filters';

interface Props {
  onSetActiveFilter: React.Dispatch<React.SetStateAction<FILTERS>>;
}

export const Filter: React.FC<Props> = ({ onSetActiveFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState(FILTERS.ALL);

  const handleFilter = (filterType: FILTERS) => {
    onSetActiveFilter(filterType);
    setSelectedFilter(filterType);
  };

  return (
    <nav className="filter">
      {Object.values(FILTERS).map((filterType) => (
        <a
          key={filterType}
          href={`#/${filterType.toLowerCase()}`}
          className={classNames('filter__link', {
            selected: selectedFilter === filterType,
          })}
          onClick={() => handleFilter(filterType)}
        >
          {filterType}
        </a>
      ))}
    </nav>
  );
};
