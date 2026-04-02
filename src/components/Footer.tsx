import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Status } from '../types/StatusType';

type Props = {
  todos: Todo[];
  filterStatus: Status;
  setFilterStatus: (status: Status) => void;
  onClearCompleted: () => void;
};

const filterLinks = [
  { status: Status.All, cy: 'FilterLinkAll', text: 'All' },
  { status: Status.Active, cy: 'FilterLinkActive', text: 'Active' },
  { status: Status.Completed, cy: 'FilterLinkCompleted', text: 'Completed' },
];

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Navigation for filtering todos by status */}
      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ status, cy, text }) => (
          <button
            key={status}
            type="button"
            className={classNames('filter__link', {
              selected: filterStatus === status,
            })}
            data-cy={cy}
            onClick={() => setFilterStatus(status)}
          >
            {text}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
