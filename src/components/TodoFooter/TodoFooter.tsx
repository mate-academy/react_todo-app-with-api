import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
}) => {
  const todoLeftCounter = todos.filter(todo => !todo.completed).length;
  const noCompletedTodos = !todos.some(todo => todo.completed);
  const filterIsActive = filter === FilterType.Active;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todoLeftCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={noCompletedTodos || filterIsActive}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
