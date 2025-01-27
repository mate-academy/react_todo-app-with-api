import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[];
  onFilter: React.Dispatch<React.SetStateAction<Status>>;
  filter: string;
  handleDeleteAllCompleted: (currentsTodo: number[]) => void;
};

const statusLabels = {
  [Status.ALL]: 'All',
  [Status.ACTIVE]: 'Active',
  [Status.COMPLETED]: 'Completed',
};

export const Footer: React.FC<Props> = ({
  todos,
  onFilter,
  filter,
  handleDeleteAllCompleted,
}) => {
  const hasCompletedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const remainingTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(status => (
          <a
            key={status}
            href={`#/${status === Status.ALL ? '' : status}`}
            className={cn('filter__link', { selected: filter === status })}
            data-cy={`FilterLink${statusLabels[status]}`}
            onClick={() => onFilter(status)}
          >
            {statusLabels[status]}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos.length}
        onClick={() => handleDeleteAllCompleted(hasCompletedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
