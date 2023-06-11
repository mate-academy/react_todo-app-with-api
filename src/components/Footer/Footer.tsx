import React from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';

type Props = {
  selectedStatus: Status,
  onHandleStatus:React.MouseEventHandler<HTMLAnchorElement>,
  itemsLeftCount: number,
  onDeleteCompletedTodo: () => Promise<void>,
};

export const Footer: React.FC<Props> = ({
  selectedStatus,
  onHandleStatus,
  itemsLeftCount,
  onDeleteCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeftCount} `}
        items left
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === Status.default },
            )
          }
          data-type={Status.default}
          onClick={onHandleStatus}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === Status.active },
            )
          }
          onClick={onHandleStatus}
          data-type={Status.active}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === Status.completed },
            )
          }
          onClick={onHandleStatus}
          data-type={Status.completed}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompletedTodo}
      >
        Clear completed
      </button>
    </footer>
  );
};
