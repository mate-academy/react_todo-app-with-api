import cn from 'classnames';
import { Statuses } from '../../types/Statuses';
import { Todo } from '../../types/Todo';

interface Props {
  status: Statuses;
  setStatus: React.Dispatch<React.SetStateAction<Statuses>>;
  activeTodos: Todo[];
  completedTodos: Todo[];
  onDeleteCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  status,
  setStatus,
  activeTodos,
  completedTodos,
  onDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatus(Statuses.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatus(Statuses.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatus(Statuses.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
