import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { FILTERS } from '../../../constants/filters';
import { FooterContext } from '../../../context/FooterContext';

export const Filter: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState(FILTERS.ALL);
  const { setActiveFilter } = useContext(FooterContext);
  const { t } = useTranslation();

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
          {t(`Footer.${filterType.toLowerCase()}`)}
        </a>
      ))}
    </nav>
  );
};
