import cn from 'classnames';
import { TodosStatus } from '../../types/enums';
import React from 'react';

interface Props {
  itemsCount: number;
  activeStatus: TodosStatus;
  onStatusChange: (status: TodosStatus) => void;
  noCompletedTodos: boolean;
  onClearCompleted: () => void;
}

const FILTER_LINKS = [
  { status: TodosStatus.ALL, href: '#/', text: 'All' },
  { status: TodosStatus.ACTIVE, href: '#/active', text: 'Active' },
  { status: TodosStatus.COMPLETED, href: '#/completed', text: 'Completed' },
];

const FooterComponent: React.FC<Props> = ({
  itemsCount,
  activeStatus,
  onStatusChange,
  noCompletedTodos,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(({ status, href, text }) => (
          <a
            key={href}
            href={href}
            className={cn('filter__link', {
              selected: status === activeStatus,
            })}
            data-cy={`FilterLink${text}`}
            onClick={event => {
              event.preventDefault();
              onStatusChange(status);
            }}
          >
            {text}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={noCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);
