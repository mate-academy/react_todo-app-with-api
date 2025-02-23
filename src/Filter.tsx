import classNames from 'classnames';
import { FilterType } from './types/FilterType';

type Props = {
  filtered: string;
  setFiltered: (selected: string) => void;
};

export const Filter: React.FC<Props> = ({ filtered, setFiltered }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterType).map((filterType, index) => (
        <a
          key={index}
          href="#/"
          className={classNames('filter__link', {
            selected: filtered === filterType,
          })}
          data-cy={`FilterLink${filterType}`}
          onClick={() => setFiltered(filterType)}
        >
          {filterType}
        </a>
      ))}
    </nav>
  );
};
