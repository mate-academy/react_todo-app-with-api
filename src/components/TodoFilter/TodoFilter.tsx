import classNames from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  handleFilterStatus: (status: Status) => void,
  todosFilterStatus: Status
};

export const TodoFilter: React.FC<Props> = ({
  handleFilterStatus,
  todosFilterStatus,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: todosFilterStatus === Status.All,
        })}
        onClick={() => handleFilterStatus(Status.All)}
      >
        {Status.All}
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: todosFilterStatus === Status.Active,
        })}
        onClick={() => handleFilterStatus(Status.Active)}
      >
        {Status.Active}
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: todosFilterStatus === Status.Completed,
        })}
        onClick={() => handleFilterStatus(Status.Completed)}
      >
        {Status.Completed}
      </a>
    </nav>
  );
};
