import { FC } from 'react';
import { FilterStatus } from '../utils/FilterStatus';
import { Todo } from '../types/Todo';

import cn from 'classnames';

type Props = {
  setFilter: (filter: FilterStatus) => void;
  filter: FilterStatus;
  todos: Todo[];
  handleDeleteCompleted: () => void;
};

export const Footer: FC<Props> = ({
  setFilter,
  filter,
  todos,
  handleDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status.toLowerCase() === 'all' ? '' : status.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
