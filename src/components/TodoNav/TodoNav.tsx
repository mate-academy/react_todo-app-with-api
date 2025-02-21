import classNames from 'classnames';
import { FilterNav } from '../../types/Filter';

type Props = {
  handleFilter: (filterName: FilterNav) => void;
  selectFilter: FilterNav;
};

export const TodoNav: React.FC<Props> = ({ handleFilter, selectFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterNav).map(item => {
        return (
          <a
            href={`#/${item.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: selectFilter === item,
            })}
            data-cy={`FilterLink${item.charAt(0).toUpperCase() + item.slice(1)}`}
            onClick={() => handleFilter(item)}
            key={item}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </a>
        );
      })}
    </nav>
  );
};
