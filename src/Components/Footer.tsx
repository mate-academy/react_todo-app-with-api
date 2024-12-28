import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterName } from '../types/FilterName';

type Props = {
  todos: Todo[];
  activeFilter: FilterName;
  setActiveFilter: (filterName: FilterName) => void;
  activeTodosQuantity: number;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  activeFilter,
  setActiveFilter,
  activeTodosQuantity,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosQuantity} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilter === 'ALL',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setActiveFilter('ALL')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilter === 'ACTIVE',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setActiveFilter('ACTIVE')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilter === 'COMPLETED',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setActiveFilter('COMPLETED')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.length === activeTodosQuantity}
        onClick={() => deleteCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
