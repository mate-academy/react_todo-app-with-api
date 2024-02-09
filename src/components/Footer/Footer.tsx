import classNames from 'classnames';
import React from 'react';
import { Status } from '../../types/Status';

type Props = {
  onChangeStatus: (status: Status) => void;
  status: Status;
  completedCount: number;
  isClearNeeded: boolean;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  onChangeStatus,
  status,
  completedCount,
  onClearCompleted,
  isClearNeeded,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === Status.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onChangeStatus(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onChangeStatus(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onChangeStatus(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={isClearNeeded}
      >
        Clear completed
      </button>
    </footer>
  );
};
