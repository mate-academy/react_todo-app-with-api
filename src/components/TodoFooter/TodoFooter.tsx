import cn from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

interface Props {
  allTodos: Todo[]
  visibleTodos: Todo[]
  status: Status
  onStatus: (status: Status) => void
  onClear: () => void
}

export const TodoFooter: React.FC<Props> = ({
  allTodos, visibleTodos, status, onStatus, onClear,
}) => {
  const activeTodosQuantity = allTodos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosQuantity} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === Status.Active,
          })}
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
        onClick={onClear}
        disabled={visibleTodos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
