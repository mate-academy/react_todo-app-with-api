import classNames from 'classnames';
import { FilterOptions } from '../types/FilterOptions';
import { Todo } from '../types';

type Props = {
  activeTodos: Todo[];
  filter: FilterOptions;
  setFilter: (filter: FilterOptions) => void;
  isAllActive: boolean;
  onDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  filter,
  setFilter,
  isAllActive,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterOptions.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterOptions.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterOptions.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterOptions.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterOptions.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterOptions.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isAllActive}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
