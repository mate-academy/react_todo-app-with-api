import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosCount: number;
  completedTodos: number;
  filter: FilterStatus;
  onFilterChange: (option: FilterStatus) => void;
  onDeleteCompleteAll: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  onFilterChange,
  onDeleteCompleteAll,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status !== FilterStatus.All ? status.toLowerCase() : ''}`}
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => onFilterChange(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleteAll}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
