import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { SortOrder } from '../types/SortOrder';

interface Props {
  activeTodos: number;
  sorted: string;
  setSorted: (value: SortOrder) => void;
  todos: Todo[];
  onDeleteAll: () => void;
}
export const FooterTodo: React.FC<Props> = ({
  activeTodos,
  sorted,
  setSorted,
  todos,
  onDeleteAll,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: sorted === SortOrder.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSorted(SortOrder.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: sorted === SortOrder.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSorted(SortOrder.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: sorted === SortOrder.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSorted(SortOrder.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteAll}
        disabled={!todos.some(t => t.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
