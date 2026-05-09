import { getActiveTodosCount } from '../utils/functions';
import { FilterPatterns, FooterProps } from '../types/Types';

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  setFilter,
  checkComplete,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${getActiveTodosCount(todos)} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            filter === 'all' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterPatterns.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            filter === 'active' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterPatterns.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            filter === 'completed' ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterPatterns.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!checkComplete}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
