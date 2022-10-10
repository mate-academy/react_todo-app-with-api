import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';

interface Props {
  filterStatus: string,
  setFilterStatus: (type: FilterStatus) => void,
  activeTodos: Todo[],
  completedTodos: Todo[],
  removeCompletedTodos: () => void,
}

export const Footer: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  activeTodos,
  completedTodos,
  removeCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterStatus === FilterStatus.All },
          )}
          onClick={() => setFilterStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterStatus === FilterStatus.Active },
          )}
          onClick={() => setFilterStatus(FilterStatus.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterStatus === FilterStatus.Completed },
          )}
          onClick={() => setFilterStatus(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        disabled={!completedTodos.length}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
