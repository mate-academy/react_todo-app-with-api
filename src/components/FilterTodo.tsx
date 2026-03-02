import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterType } from '../utils/todoFilters';

type Props = {
  todos: Todo[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  handleClearCompleted: () => void;
};

export const FilterTodo = ({
  todos,
  filter,
  setFilter,
  handleClearCompleted,
}: Props) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filter === FilterType.ALL,
              })}
              data-cy="FilterLinkAll"
              onClick={() => setFilter(FilterType.ALL)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filter === FilterType.ACTIVE,
              })}
              data-cy="FilterLinkActive"
              onClick={() => setFilter(FilterType.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filter === FilterType.COMPLETED,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilter(FilterType.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!todos.some(todo => todo.completed)}
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
