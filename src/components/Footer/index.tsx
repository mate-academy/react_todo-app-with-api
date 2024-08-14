import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

type Props = {
  onClick: (status: TodoStatus) => void;
  status: string;
  activeTodos: number;
  completedTodos: Todo[];
  onDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  onClick,
  status,
  activeTodos,
  completedTodos,
  onDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos + ' items left'}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: status === TodoStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onClick(TodoStatus.All)}
        >
          All
        </a>
        <a
          href="#/active"
          className={cn('filter__link', {
            selected: status === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => onClick(TodoStatus.Active)}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: status === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onClick(TodoStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos.length}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
