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
          { selected: sort === Sort.All },
        )}
        onClick={() => setSort(Sort.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: sort === Sort.Active },
        )}
        onClick={() => setSort(Sort.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: sort === Sort.Completed },
        )}
        onClick={() => setSort(Sort.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
