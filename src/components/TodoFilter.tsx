import classNames from 'classnames';
import { FilteredTodos } from '../enums/FilteresTodos';

interface Props {
  setFilterSelected: (filterSelected: FilteredTodos) => void;
  filterSelected: FilteredTodos;
}

export const TodoFilter: React.FC<Props> = ({
  setFilterSelected,
  filterSelected,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilteredTodos).map(filter => (
        <a
          href="#/"
          key={filter}
          className={classNames('filter__link', {
            selected: filterSelected === filter,
          })}
          onClick={() => setFilterSelected(filter)}
          data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
