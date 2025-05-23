import classNames from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[];
  activeFilter: FilterType;
  activeTodosCount: number;
  setActiveFilter: (type: FilterType) => void;
  deleteCompletedTodos: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  activeFilter,
  activeTodosCount,
  setActiveFilter,
  deleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filter => (
          <a
            key={filter}
            href={`#/${filter === 'all' ? '' : filter}`}
            className={classNames('filter__link', {
              selected: activeFilter === filter,
            })}
            data-cy={`FilterLink${filter.charAt(0).toUpperCase()}${filter.slice(1)}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter[0].toUpperCase() + filter.slice(1)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
