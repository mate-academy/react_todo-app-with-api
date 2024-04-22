import './filter.scss';
import { FilterItem } from '../FilterItem';
import { allFilters } from '../../../../constants';

export const FilterContainer: React.FC = () => {
  return (
    <nav className="filter" data-cy="Filter">
      {allFilters.map(filter => {
        return <FilterItem value={filter} key={filter} />;
      })}
    </nav>
  );
};
