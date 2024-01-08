import classNames from 'classnames';
import { useTodoContext } from '../context';

export const TodoFilter = () => {
  const {
    activeFilter,
    handleTodosFilter,
  } = useTodoContext();

  const filters = ['All', 'Active', 'Completed'];

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(filter => (
        <a
          href={`#/${filter}`}
          className={classNames('filter__link', {
            selected: activeFilter === filter,
          })}
          data-cy={`FilterLink${filter}`}
          onClick={() => handleTodosFilter(filter)}
        >
          {filter}
        </a>
      ))}
    </nav>
  );
};
