import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { FILTERS } from '../../../constants/filters';
import { FooterContext } from '../../../context/FooterContext';

export const Filter: React.FC = React.memo(() => {
  const { activeFilter, setActiveFilter } = useContext(FooterContext);
  const { t } = useTranslation();

  const handleFilter = (filterType: FILTERS) => {
    setActiveFilter(filterType);
  };

  return (
    <nav className="filter">
      {Object.values(FILTERS).map((filterType) => (
        <a
          key={filterType}
          href={`#/${filterType.toLowerCase()}`}
          className={classNames('filter__link', {
            selected: activeFilter === filterType,
          })}
          onClick={() => handleFilter(filterType)}
        >
          {t(`Footer.${filterType.toLowerCase()}`)}
        </a>
      ))}
    </nav>
  );
});
