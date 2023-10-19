import cn from 'classnames';
import { useTodoFilter } from './useToDoFilter';
import { Filter } from './types';

export const TodoFilter:React.FC = () => {
  const { onChangeFilter, activeFilter } = useTodoFilter();

  return (
    <nav className="filter" data-cy="Filter">
      {Object.keys(Filter).map((filterName:string) => (
        <a
          key={filterName}
          href={`#/${filterName}`}
          data-cy={`FilterLink${filterName}`}
          className={cn('filter__link', {
            selected: activeFilter === filterName,
          })}
          onClick={() => onChangeFilter(filterName as Filter)}
        >
          {filterName}
        </a>
      ))}
    </nav>
  );
};
