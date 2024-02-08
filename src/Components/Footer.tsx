import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

interface Props {
  onStatus: (value: Status) => void
  status: Status,
  todos: Todo[],
  handleClearCompleted: () => void
}

export const Footer: React.FC<Props> = ({
  handleClearCompleted,
  onStatus,
  status,
  todos,
}) => {
  const activeTodos = todos.filter(
    todo => !todo.completed,
  ).length;

  const disable = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === Status.All
          || !status,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', { selected: status === Status.Active })}
          data-cy="FilterLinkActive"
          onClick={() => onStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!disable}
      >
        Clear completed
      </button>

    </footer>
  );
};
