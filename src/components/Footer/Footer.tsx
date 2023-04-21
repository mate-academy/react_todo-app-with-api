// import classNames from "classnames"
import classNames from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  setFilterType: (value: Status) => void,
  filterType: Status,
  onClearCompleted: () => void,
  activeTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  todos,
  setFilterType,
  filterType,
  onClearCompleted,
  activeTodos,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);

  const onFilterChange = (status: Status) => () => {
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
          className={classNames('filter__link', {
            selected: filterType === Status.All,
          })}
          onClick={onFilterChange(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterType === Status.Active,
          })}
          onClick={onFilterChange(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterType === Status.Completed,
          })}
          onClick={onFilterChange(Status.Completed)}
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
