/* eslint-disable import/no-extraneous-dependencies */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FilteredValue } from '../types/FilteredValue';

interface Props {
  filter: FilteredValue;
  setFilter: (value: FilteredValue) => void;
}

export const Filter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FilteredValue.All,
        })}
        onClick={() => setFilter(FilteredValue.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilteredValue.Active,
        })}
        onClick={() => setFilter(FilteredValue.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilteredValue.Completed,
        })}
        onClick={() => setFilter(FilteredValue.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};

Filter.propTypes = {
  filter: PropTypes.oneOf([
    FilteredValue.All,
    FilteredValue.Active,
    FilteredValue.Completed,
  ]).isRequired,
  setFilter: PropTypes.func.isRequired,
};
