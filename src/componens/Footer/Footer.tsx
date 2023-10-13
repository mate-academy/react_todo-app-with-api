import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import * as statusAction from '../../features/status';

interface Props {
  clearCompleted: () => void
}

export const Footer: React.FC<Props> = (
  {
    clearCompleted,
  },
) => {
  const todos = useAppSelector(state => state.todos.todos);
  const todosCompleted = todos.filter(todo => todo.completed);
  const todosActive = todos.filter(todo => !todo.completed);
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.status.statusFilter);

  enum StatusFilter {
    ALL = 'all',
    ACTIVE = 'active',
    COMPLETED = 'completed',
  }

  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span
        data-cy="TodosCounter"
        className="todo-count"
      >
        {`${todosActive.length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav
        className="filter"
        data-cy="Filter"
      >
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={
            classNames('filter__link',
              { selected: status === StatusFilter.ALL })
          }
          onClick={(e) => {
            e.preventDefault();
            dispatch(statusAction.setStatusFilter(StatusFilter.ALL));
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={
            classNames('filter__link',
              { selected: status === StatusFilter.ACTIVE })
          }
          onClick={(e) => {
            e.preventDefault();
            dispatch(statusAction.setStatusFilter(StatusFilter.ACTIVE));
          }}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={
            classNames('filter__link',
              { selected: status === StatusFilter.COMPLETED })
          }
          onClick={(e) => {
            e.preventDefault();
            dispatch(statusAction.setStatusFilter(StatusFilter.COMPLETED));
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        disabled={!todosCompleted.length}
      >
        Clear completed
      </button>

    </footer>
  );
};
