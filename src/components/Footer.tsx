import { TodoFilter } from '../types/Filter';
import cn from 'classnames';

interface FooterProps {
  currentFilter: TodoFilter;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: TodoFilter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentFilter,
  activeCount,
  completedCount,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoFilter).map(filterType => (
          <a
            key={filterType}
            href={`#/${filterType}`}
            className={cn('filter__link', {
              selected: currentFilter === filterType,
            })}
            data-cy={`FilterLink${filterType[0].toUpperCase() + filterType.slice(1)}`}
            onClick={() => onFilterChange(filterType)}
          >
            {filterType[0].toUpperCase() + filterType.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
