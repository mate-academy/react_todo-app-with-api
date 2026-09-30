import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosCount: number;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  hasCompletedTodos: boolean;
  handleClearCompleted: () => void;
};

export const TodoFooter = ({
  activeTodosCount,
  filter,
  setFilter,
  hasCompletedTodos,
  handleClearCompleted,
}: Props) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === FilterStatus.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
