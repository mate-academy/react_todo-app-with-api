import { FC } from 'react';
import { Status } from '../types/Status';

interface Props {
  selectedStatus: Status;
  setSelectedStatus: (status: Status) => void;
  onClearCompleted: () => void;
  activeTodosCount: number;
  completedTodosCount: number;
}

const Footer: FC<Props> = ({
  selectedStatus,
  setSelectedStatus,
  onClearCompleted,
  activeTodosCount,
  completedTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${selectedStatus === Status.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${selectedStatus === Status.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${selectedStatus === Status.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosCount}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
