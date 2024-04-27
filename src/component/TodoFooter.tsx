import classNames from 'classnames';
import { useContext } from 'react';
import { TodosContext } from '../TodosProvider/TodosProvider';

export const TodoFooter: React.FC = () => {
  const { todos, handleClearCompleted, selectFilter, setSelectFilter } =
    useContext(TodosContext);

  const visibleClearCompleted = todos.some(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectFilter === '#/' || !selectFilter,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectFilter('#/')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectFilter === '#/active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectFilter('#/active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectFilter === '#/completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectFilter('#/completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!visibleClearCompleted}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
