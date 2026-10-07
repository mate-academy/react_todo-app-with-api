import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  todosCount: number;
  onFilterChange: (filter: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

const FILTER_LINKS = [
  { filter: Filter.All, label: 'All', href: '#/' },
  { filter: Filter.Active, label: 'Active', href: '#/active' },
  { filter: Filter.Completed, label: 'Completed', href: '#/completed' },
];

export const Footer: React.FC<Props> = ({
  filter,
  todosCount,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCount} {todosCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(({ filter: linkFilter, label, href }) => (
          <a
            key={linkFilter}
            href={href}
            className={classNames('filter__link', {
              selected: filter === linkFilter,
            })}
            data-cy={`FilterLink${label}`}
            onClick={() => onFilterChange(linkFilter)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
