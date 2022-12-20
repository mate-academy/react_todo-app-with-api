import classNames from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';

interface Props {
  filteredBy: FilterOptions,
  onOptionChange: (option: FilterOptions) => void,
}

export const TodoFilter: React.FC<Props> = ({
  filteredBy,
  onOptionChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filteredBy === FilterOptions.ALL },
        )}
        onClick={() => {
          onOptionChange(FilterOptions.ALL);
        }}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filteredBy === FilterOptions.ACTIVE },
        )}
        onClick={() => {
          onOptionChange(FilterOptions.ACTIVE);
        }}
      >
        Active
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filteredBy === FilterOptions.COMPLETED },
        )}
        onClick={() => {
          onOptionChange(FilterOptions.COMPLETED);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
