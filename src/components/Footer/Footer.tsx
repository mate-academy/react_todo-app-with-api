import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodosCount: number;
  filterBy: FilterType;
  setFilterBy: (arg0: FilterType) => void;
  deleteCompletedTodos: () => Promise<void>;
  completedTodos: Todo[];
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filterBy,
  setFilterBy,
  deleteCompletedTodos,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterType.All,
            },
          )}
          onClick={() => setFilterBy(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterType.Active,
            },
          )}
          onClick={() => setFilterBy(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filterBy === FilterType.Completed,
            },
          )}
          onClick={() => setFilterBy(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            hidden: !completedTodos.length,
          },
        )}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
