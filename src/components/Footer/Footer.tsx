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
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: activeFilter === filterStatus.ALL,
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: activeFilter === filterStatus.ACTIVE,
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: activeFilter === filterStatus.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
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
