import classNames from 'classnames';
import { Filters } from '../../types/enums';
import { useAppContext } from '../AppProvider';

export const Footer: React.FC = () => {
  const {
    selectedFilter,
    setSelectedFilter,
    todos,
    setTodosToRemove,
    activeTodos,
  } = useAppContext();

  const activeTodosCount = activeTodos.length;

  const handleRemoveCompleted = () => {
    setTodosToRemove(todos.filter(({ completed }) => completed));
  };

  const hasCompletedTodos = todos.length - activeTodosCount > 0;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`}
      </span>

      <nav className="filter">
        {Object.values(Filters).map(filter => (
          <a
            key={filter}
            href="#/"
            className={classNames(
              'filter__link',
              { selected: filter === selectedFilter },
            )}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: hasCompletedTodos ? 'visible' : 'hidden' }}
        onClick={handleRemoveCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
