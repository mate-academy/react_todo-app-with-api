import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[];
  filter: Filter;
  changeFilter: (value: Filter) => void;
  clearCompleted: () => void;
};

const Footer: React.FC<Props> = ({
  todos,
  filter,
  changeFilter,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link ', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => changeFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link ', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => changeFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link ', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => changeFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
