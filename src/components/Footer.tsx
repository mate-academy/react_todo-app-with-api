import { FilterBy } from '../types/FilterBy';
import { Props } from '../types/Props';

interface FilterOption {
  label: string;
  value: FilterBy;
  dataCy: string;
}

interface FilterLinkProps {
  label: string;
  value: FilterBy;
  dataCy: string;
  onClick: (filter: FilterBy) => void;
  isSelected: boolean;
}

const FilterLink: React.FC<FilterLinkProps> = ({
  label,
  value,
  dataCy,
  onClick,
  isSelected,
}) => (
  <a
    href={`#/${value.toLowerCase()}`}
    className={`filter__link ${isSelected ? 'selected' : ''}`}
    data-cy={dataCy}
    onClick={() => onClick(value)}
  >
    {label}
  </a>
);

export const Footer: React.FC<Props> = ({
  todosCounter,
  filterBy,
  setFilterBy,
  todos,
  onCompletedDelete,
}) => {
  const activeTodos = todos.filter(todo => todo.completed);

  const filterOptions: FilterOption[] = [
    { label: 'All', value: FilterBy.All, dataCy: 'FilterLinkAll' },
    { label: 'Active', value: FilterBy.Active, dataCy: 'FilterLinkActive' },
    { label: 'Completed', value: FilterBy.Completed, dataCy: 'FilterLinkCompleted' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosCounter} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
      {filterOptions.map((option) => (
        <FilterLink
          key={option.value}
          label={option.label}
          value={option.value}
          dataCy={option.dataCy}
          onClick={setFilterBy}
          isSelected={filterBy === option.value}
          />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onCompletedDelete}
        disabled={!activeTodos.length}
      >
        Clear completed
      </button>

    </footer>
  );
};
