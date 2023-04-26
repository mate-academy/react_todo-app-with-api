import classNames from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterStatus,
  setFilterType: (value: FilterStatus) => void,
  todos: Todo[],
  onClearCompleted: () => void,
  activeTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  filterType,
  setFilterType,
  todos,
  onClearCompleted,
  activeTodos,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);

  const onFilterChange = (status: FilterStatus) => () => {
    setFilterType(status);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filterType === FilterStatus.All })}
          onClick={onFilterChange(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filterType === FilterStatus.Active })}
          onClick={onFilterChange(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterType === FilterStatus.Completed })}
          onClick={onFilterChange(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--unvisible': !hasCompleted,
        })}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
