import cn from 'classnames';

type Props = {
  countActiveTodos: number;
  activeFilter: string;
  hasCompletedTodos: boolean;
  onClearCompleted: () => void;
  filterStatus: {
    readonly ALL: 'all';
    readonly ACTIVE: 'active';
    readonly COMPLETED: 'completed';
  };
};

export const Footer: React.FC<Props> = ({
  countActiveTodos,
  activeFilter,
  hasCompletedTodos,
  onClearCompleted,
  filterStatus,
}) => {
  const filterLinks = [
    {
      href: '#/',
      status: filterStatus.ALL,
      label: 'All',
      dataCy: 'FilterLinkAll',
    },
    {
      href: '#/active',
      status: filterStatus.ACTIVE,
      label: 'Active',
      dataCy: 'FilterLinkActive',
    },
    {
      href: '#/completed',
      status: filterStatus.COMPLETED,
      label: 'Completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ href, status, label, dataCy }) => (
          <a
            key={status}
            href={href}
            className={cn('filter__link', {
              selected: activeFilter === status,
            })}
            data-cy={dataCy}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={() => onClearCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
};
