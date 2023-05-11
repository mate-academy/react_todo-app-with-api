import { useContext, useState } from 'react';
import classNames from 'classnames';
import { FILTERS } from '../../../constants/filters';
import { FooterContext } from '../../../context/FooterContext';

// interface Props {
//   onSetActiveFilter: React.Dispatch<React.SetStateAction<FILTERS>>;
// }

export const Filter: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState(FILTERS.ALL);
  const { setActiveFilter } = useContext(FooterContext);

  const handleFilter = (filterType: FILTERS) => {
    setActiveFilter(filterType);
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
