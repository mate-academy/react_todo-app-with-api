import { FilterType, filters } from '../types/Filter';

type TodoFooterProps = {
  activeCount: number;
  filterType: FilterType;
  hasCompleted: boolean;
  onFilterChange: (filterType: FilterType) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  activeCount,
  filterType,
  hasCompleted,
  onFilterChange,
  onClearCompleted,
}) => {
  const itemsLabel = activeCount === 1 ? 'item' : 'items';

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {itemsLabel} left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.type}
            href={filter.href}
            className={`filter__link ${
              filterType === filter.type ? 'selected' : ''
            }`}
            data-cy={filter.dataCy}
            onClick={() => onFilterChange(filter.type)}
          >
            {filter.title}
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
