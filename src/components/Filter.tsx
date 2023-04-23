import classNames from 'classnames';
import { useTodosContext } from '../context';
import { Sort } from '../types/Sort';

export const Filter = () => {
  const { setSort, sort } = useTodosContext();

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: sort === Sort.all },
        )}
        onClick={() => setSort(Sort.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: sort === Sort.active },
        )}
        onClick={() => setSort(Sort.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: sort === Sort.completed },
        )}
        onClick={() => setSort(Sort.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
