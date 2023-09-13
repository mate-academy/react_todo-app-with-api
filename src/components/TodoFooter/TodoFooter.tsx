import React, { useCallback } from 'react';
import classNames from 'classnames';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  onFilter: (str: TodoStatus) => void,
  filter: TodoStatus,
  itemsLeft: number,
  completedCount: number,
  onClearCompleted: () => void,
};

export const TodoFooter: React.FC<Props> = React.memo(({
  filter,
  itemsLeft,
  onFilter,
  onClearCompleted,
  completedCount,
}) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const { textContent } = event.currentTarget;

      onFilter(textContent as TodoStatus);
    }, [onFilter],
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: TodoStatus.All === filter,
          })}
          onClick={handleClick}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: TodoStatus.Active === filter,
          })}
          onClick={handleClick}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: TodoStatus.Completed === filter,
          })}
          onClick={handleClick}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!completedCount}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
