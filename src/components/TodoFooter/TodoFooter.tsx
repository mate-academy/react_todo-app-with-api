import { FilterStatus } from '../../types/enums';
import cn from 'classnames';

interface Props {
  undoneTodosCount: number;
  filterStatus: FilterStatus;
  isAllTodosUncompleted: boolean;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
}

interface FilterLink {
  status: FilterStatus;
  href: string;
  'data-cy': string;
}

const TodoFooter = ({
  undoneTodosCount,
  filterStatus,
  isAllTodosUncompleted,
  onFilterChange,
  onClearCompleted,
}: Props) => {
  const filterAnchors: FilterLink[] = [
    { status: FilterStatus.All, href: '#/', 'data-cy': 'FilterLinkAll' },
    {
      status: FilterStatus.Active,
      href: '#/active',
      'data-cy': 'FilterLinkActive',
    },
    {
      status: FilterStatus.Completed,
      href: '#/completed',
      'data-cy': 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${undoneTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterAnchors.map(filter => (
          <a
            key={filter.status}
            href={filter.href}
            data-cy={filter['data-cy']}
            className={cn('filter__link', {
              selected: filterStatus === filter.status,
            })}
            onClick={() => onFilterChange(filter.status)}
          >
            {FilterStatus[filter.status]}
          </a>
        ))}
      </nav>

      <button
        disabled={isAllTodosUncompleted}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodoFooter;
