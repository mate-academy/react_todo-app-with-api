import { useContext } from 'react';
import cn from 'classnames';
import { Status } from '../types/Todo';
import { TodosContext } from './TodosContext';

export const TodoFilter: React.FC = () => {
  const {
    selectedStatus, setSelectedStatus,
  } = useContext(TodosContext);

  const handleStatusChange = (status: Status) => {
    setSelectedStatus(status);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: selectedStatus === Status.all,
        })}
        data-cy="FilterLinkAll"
        onClick={() => handleStatusChange(Status.all)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: selectedStatus === Status.active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => handleStatusChange(Status.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: selectedStatus === Status.completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => handleStatusChange(Status.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
