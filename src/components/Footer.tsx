import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  onFilterStatus: (status: Status) => void,
  todosFilterStatus: Status,
  onDeleteCompleated: () => void,
  hasCompleted: boolean;
  activeTodosCount: number;
};

export const Footer: React.FC<Props> = ({
  onFilterStatus,
  todosFilterStatus,
  onDeleteCompleated,
  hasCompleted,
  activeTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${activeTodosCount !== 1 ? 'items' : 'item'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {(Object.keys(Status) as Array<keyof typeof Status>)
          .map((key) => (
            <a
              href="#/completed"
              data-cy="FilterLinkCompleted"
              className={classNames('filter__link', {
                selected: todosFilterStatus === Status[key],
              })}
              onClick={(event) => {
                event.preventDefault();
                onFilterStatus(Status[key]);
              }}
              key={key}
            >
              {key}
            </a>
          ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onDeleteCompleated()}
        disabled={!hasCompleted}
        hidden={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
