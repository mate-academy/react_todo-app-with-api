import { Filter } from '../types/Filter';

export const FormFooter = ({
  remainingCount,
  filter,
  onFilterChange,
  hasCompleted,
  onClearCompleted,
}: {
  remainingCount: number;
  filter: Filter;
  onFilterChange: (f: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => Promise<void> | void;
}) => {
  const filters = [
    { value: Filter.All, label: 'All', cy: 'FilterLinkAll' },
    { value: Filter.Active, label: 'Active', cy: 'FilterLinkActive' },
    { value: Filter.Completed, label: 'Completed', cy: 'FilterLinkCompleted' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {remainingCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(f => (
          <a
            key={f.value}
            href={`#/${f.value}`}
            className={`filter__link ${filter === f.value ? 'selected' : ''}`}
            data-cy={f.cy}
            onClick={e => {
              e.preventDefault();
              onFilterChange(f.value);
            }}
          >
            {f.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
