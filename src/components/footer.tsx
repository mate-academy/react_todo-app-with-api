import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

type Props = {
  activeItems: Todo[];
  filterType: TodoStatus;
  setFilterType: (type: TodoStatus) => void;
  completedItems: Todo[];
  onDeleteAllCompleted: (todos: Todo[]) => void;
};

export const Footer: React.FC<Props> = ({
  activeItems,
  filterType,
  setFilterType,
  completedItems,
  onDeleteAllCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeItems.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: TodoStatus.all === filterType,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterType(TodoStatus.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: TodoStatus.active === filterType,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterType(TodoStatus.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: TodoStatus.completed === filterType,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterType(TodoStatus.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedItems.length === 0}
        onClick={() => onDeleteAllCompleted(completedItems)}
      >
        Clear completed
      </button>
    </footer>
  );
};
