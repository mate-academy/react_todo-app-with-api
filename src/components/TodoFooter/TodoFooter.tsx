import './TodoFooter.scss';
import { FilterTypes } from '../../types/FilterTypes';
import { clsx } from 'clsx';
import { Filter } from '../../enums/Filter';

interface Props {
  activeTodos: number;
  filterType: FilterTypes;
  onFilterTypeChange: (type: FilterTypes) => void;
  hasCompletedTodos: boolean;
  handleClearCompleted: () => void;
}

const filters = [
  { label: 'All', value: Filter.All, href: '#/', dataCy: 'FilterLinkAll' },
  {
    label: 'Active',
    value: Filter.Active,
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    label: 'Completed',
    value: Filter.Completed,
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter = ({
  activeTodos,
  filterType,
  onFilterTypeChange,
  hasCompletedTodos,
  handleClearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.value}
            href={filter.href}
            className={clsx('filter__link', {
              selected: filterType === filter.value,
            })}
            data-cy={filter.dataCy}
            onClick={() => onFilterTypeChange(filter.value)}
          >
            {filter.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
