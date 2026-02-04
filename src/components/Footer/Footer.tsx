import classNames from 'classnames';

import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeCount: number;
  completedTodos: number;
  filter: FilterStatus;
  onFilterChange: (option: FilterStatus) => void;
  onDeleteCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  completedTodos,
  filter,
  onFilterChange,
  onDeleteCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status === FilterStatus.All ? '' : status.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            data-cy={`FilterLink${status}`}
            onClick={() => {
              onFilterChange(status);
            }}
          >
            {status}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompletedTodo}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
