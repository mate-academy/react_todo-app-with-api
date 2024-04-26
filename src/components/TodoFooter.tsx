import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  activeTodosAmount: number;
  hasCompletedTodos: boolean;
  currentFilter: Filter;
  handleFilterChange: (filter: Filter) => () => void;
  handleClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosAmount,
  hasCompletedTodos,
  currentFilter,
  handleFilterChange,
  handleClearCompleted,
}) => {
  const getFilterClass = (linkFilter: Filter) =>
    classNames({
      filter__link: true,
      selected: linkFilter === currentFilter,
    });

  const todoCounterText = `${activeTodosAmount} item${activeTodosAmount === 1 ? '' : 's'} left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoCounterText}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={getFilterClass(Filter.All)}
          data-cy="FilterLinkAll"
          onClick={handleFilterChange(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={getFilterClass(Filter.Active)}
          data-cy="FilterLinkActive"
          onClick={handleFilterChange(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={getFilterClass(Filter.Completed)}
          data-cy="FilterLinkCompleted"
          onClick={handleFilterChange(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodos}
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
