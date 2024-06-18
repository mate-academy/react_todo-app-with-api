import { FC } from 'react';
import cn from 'classnames';

import { Status } from '../types/Status';

interface Props {
  activeTodosCount: number;
  selectedStatus: Status;
  setSelectedStatus: (status: Status) => void;
  deleteAllCompleted: () => void;
  canClearAllVisible: boolean;
}

const Footer: FC<Props> = ({
  activeTodosCount,
  selectedStatus,
  setSelectedStatus,
  deleteAllCompleted,
  canClearAllVisible,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedStatus === Status.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedStatus(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedStatus === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedStatus(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedStatus === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedStatus(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteAllCompleted}
        disabled={!canClearAllVisible}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
