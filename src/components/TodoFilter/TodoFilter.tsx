import classNames from 'classnames';
import { useTodos } from '../../contexts/todosContext';

export type Filters = 'all' | 'active' | 'completed';

type TodoFilterProps = {
  activeFilter: Filters;
  completedTodosCount: number;
  activeTodosCount: number;
  changeFilter: (filterName: Filters) => void;
};

export const TodoFilter = ({
  changeFilter,
  activeFilter,
  completedTodosCount,
  activeTodosCount,
}: TodoFilterProps) => {
  const { handleClearCompleted } = useTodos();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodosCount} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: activeFilter === 'all',
          })}
          onClick={() => changeFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: activeFilter === 'active',
          })}
          onClick={() => changeFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: activeFilter === 'completed',
          })}
          onClick={() => changeFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {completedTodosCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
