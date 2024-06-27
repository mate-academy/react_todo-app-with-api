import React from 'react';
import { filterLinks } from '../../types/Todo';
import { Filter } from '../../helpers';

type Props = {
  completedTodos: number;
  notCompletedTodos: number;
  filter: string;
  setFilter: (filter: Filter) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  completedTodos,
  notCompletedTodos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ key, label, href }) => (
          <a
            key={key}
            href={href}
            className={`filter__link ${filter === key ? `selected` : ``}`}
            data-cy={`FilterLink${label}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
