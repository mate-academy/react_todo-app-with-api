import { useContext } from 'react';
import { TodosContext } from '../../stor/Context';
import classNames from 'classnames';

type Props = {};

enum FilerType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const Footer: React.FC<Props> = () => {
  const { todos, filterField, setFilterField, clearCompleted, stateClearBtn } =
    useContext(TodosContext);

  const count = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${count} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterField === FilerType.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterField(FilerType.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterField === FilerType.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterField(FilerType.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterField === FilerType.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterField(FilerType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={stateClearBtn}
      >
        Clear completed
      </button>
    </footer>
  );
};
