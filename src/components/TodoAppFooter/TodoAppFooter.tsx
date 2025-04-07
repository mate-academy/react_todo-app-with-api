import React from 'react';
import { FilterBy } from '../../types/Types';
import classNames from 'classnames';

type Props = {
  hasSomeCompleted: boolean;
  activeTodosCount: number;
  currentFilter: FilterBy;
  onfilterChange: (newFilter: FilterBy) => void;
  onClearCompleted: () => void;
};

export const TodoAppFooter: React.FC<Props> = ({
  hasSomeCompleted,
  activeTodosCount,
  currentFilter,
  onfilterChange,
  onClearCompleted,
}) => {
  const filters: { name: string; value: FilterBy; link: string }[] = [
    { name: 'All', value: FilterBy.All, link: '#/' },
    { name: 'Active', value: FilterBy.Active, link: '#/active' },
    { name: 'Completed', value: FilterBy.Completed, link: '#/completed' },
  ];

  const handleFilterChange = (filter: FilterBy) => () => onfilterChange(filter);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ name, value, link }) => (
          <a
            key={value}
            href={link}
            className={classNames('filter__link', {
              selected: currentFilter === value,
            })}
            data-cy={`FilterLink${name}`}
            onClick={handleFilterChange(value)}
          >
            {name}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasSomeCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
