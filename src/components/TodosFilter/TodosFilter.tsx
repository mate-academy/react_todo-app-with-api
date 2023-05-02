import classNames from 'classnames';
import { useTodoContext } from '../../context/TodoContext';
import { Statuses } from '../../types/Common';

export const TodosFilter: React.FC = () => {
  const { status, setStatus } = useTodoContext();

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: status === Statuses.ALL,
        })}
        onClick={() => setStatus(Statuses.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: status === Statuses.ACTIVE,
        })}
        onClick={() => setStatus(Statuses.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: status === Statuses.COMPLETED,
        })}
        onClick={() => setStatus(Statuses.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
