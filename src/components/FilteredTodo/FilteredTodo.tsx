import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoContext';
import { Filter } from '../../types/Filter';

export const TodosFilter: React.FC = () => {
  const { filter, setStatus } = useTodoContext();

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === Filter.ALL,
        })}
        onClick={() => setStatus(Filter.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === Filter.ACTIVE,
        })}
        onClick={() => setStatus(Filter.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === Filter.COMPLETED,
        })}
        onClick={() => setStatus(Filter.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
