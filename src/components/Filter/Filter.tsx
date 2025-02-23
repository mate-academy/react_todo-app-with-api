import classNames from 'classnames';
import { FilterTypes } from '../../types/FilterTypes';

type Props = {
  selectedTodos: FilterTypes;
  setSelectedTodos: (state: FilterTypes) => void;
};

export const Filter: React.FC<Props> = ({
  selectedTodos,
  setSelectedTodos,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(FilterTypes).map(([filterKey, filterValue]) => (
        <a
          href={filterKey === 'All' ? `#/` : `#/${filterKey}`}
          className={classNames('filter__link', {
            selected: selectedTodos === filterValue,
          })}
          data-cy={`FilterLink${filterKey}`}
          onClick={() => {
            if (selectedTodos !== filterKey) {
              setSelectedTodos(filterValue);
            }
          }}
          key={filterKey}
        >
          {filterValue}
        </a>
      ))}
    </nav>
  );
};
