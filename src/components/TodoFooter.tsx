import classNames from 'classnames';
import { FilterParams } from '../types/messages';

interface TodoFooterProps {
  itemsLeft: number;
  setFilter: (filter: FilterParams) => void;
  filter: FilterParams;
  disabledButton: boolean;
  deleteCompletedTodos: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  itemsLeft,
  setFilter,
  filter,
  disabledButton,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterParams.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterParams.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterParams.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterParams.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterParams.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterParams.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={disabledButton}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
