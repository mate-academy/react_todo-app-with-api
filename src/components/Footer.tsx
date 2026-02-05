import React from 'react';
import cn from 'classnames';
import { FilterType } from '../types/filterType';
import { FILTER_LINKS } from '../types/FilterLinks';

interface Props {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  todoIsComplited: boolean;
  activeTodosCount: number;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  todoIsComplited,
  activeTodosCount,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(({ type, href, label, dataCy }) => (
          <a
            key={type}
            href={href}
            className={cn('filter__link', {
              selected: filter === type,
            })}
            data-cy={dataCy}
            onClick={() => setFilter(type)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todoIsComplited}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
