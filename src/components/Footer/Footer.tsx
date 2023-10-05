import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../../TodoContext';

type Props = {
  setStatus: (newStatus: Status) => void,
  onClearCompleted: () => void;
  currentStatus: Status,
  activeTodos: Todo[],
  completedTodos: Todo[],
};

export enum Status {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const Footer: React.FC<Props> = ({
  currentStatus,
  activeTodos,
  completedTodos,
  setStatus = () => { },
  onClearCompleted = () => { },
}) => {
  const { isLoading } = useTodos();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const newStatus = event.currentTarget.textContent as Status;

    setStatus(newStatus);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: currentStatus === Status.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={handleClick}
        >
          {Status.ALL}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: currentStatus === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={handleClick}
        >
          {Status.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: currentStatus === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleClick}
        >
          {Status.COMPLETED}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!completedTodos.length && !isLoading}
      >
        Clear completed
      </button>

    </footer>
  );
};
