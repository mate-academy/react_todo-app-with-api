import { useContext } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { TodosContext } from './TodosContext';

export const TodosFilters: React.FC = () => {
  const { status, setStatus } = useContext(TodosContext);

  const handleStatus = (e:React.MouseEvent, val: Status) => {
    e.preventDefault();

    setStatus(val);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link',
          { selected: status === 'all' })}
        onClick={e => handleStatus(e, Status.all)}
      >
        All
      </a>
      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link',
          { selected: status === 'active' })}
        onClick={e => handleStatus(e, Status.active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link',
          { selected: status === 'completed' })}
        onClick={e => handleStatus(e, Status.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
