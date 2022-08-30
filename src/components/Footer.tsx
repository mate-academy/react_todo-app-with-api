import classNames from 'classnames';
import { Todo } from '../types/Todo';

type FilteredTodos = 'all' | 'completed' | 'active';

interface Props {
  todos: Todo[];
  filter: FilteredTodos,
  setFilter(filter: FilteredTodos): void,
  deleteAllCompleted(): void,
}

export const Footer: React.FC<Props> = (
  {
    todos, filter, setFilter, deleteAllCompleted,
  },
) => {
  return (
    <>
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: filter === 'all',
            },
          )}
          onClick={event => {
            event.preventDefault();

            if (filter !== 'all') {
              setFilter('all');
            }
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: filter === 'active',
            },
          )}
          onClick={event => {
            event.preventDefault();

            if (filter !== 'active') {
              setFilter('active');
            }
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: filter === 'completed',
            },
          )}
          onClick={event => {
            event.preventDefault();

            if (filter !== 'completed') {
              setFilter('completed');
            }
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => deleteAllCompleted()}
        style={{
          visibility: todos.some(todo => todo.completed)
            ? 'visible'
            : 'hidden',
        }}
      >
        Clear completed
      </button>
    </>
  );
};
