import React from 'react';
import cn from 'classnames';

type Props = {
  selectedStatus: string,
  onHandleStatus: (event: React.MouseEvent<HTMLAnchorElement>) => void,
  itemsLeftCount: number,
  onDeleteCompletedTodo: () => Promise<void>,
};

export const Footer: React.FC<Props> = ({
  selectedStatus,
  onHandleStatus: onHanbleStatus,
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
              { selected: selectedStatus === 'all' },
            )
          }
          onClick={onHanbleStatus}
          type="all"
        >
          All
        </a>

        <a
          href="#/active"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === 'active' },
            )
          }
          onClick={onHanbleStatus}
          type="active"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn(
              'filter__link',
              { selected: selectedStatus === 'completed' },
            )
          }
          onClick={onHanbleStatus}
          type="completed"
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
