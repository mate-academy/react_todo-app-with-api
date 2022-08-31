import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[],
  onClearCompletedTodos: () => void,
  filter: Filter,
  setFilter: (filter: Filter) => void,
  isFooterVisible: boolean,
};

export const Footer: React.FC<Props> = ({
  todos,
  onClearCompletedTodos,
  filter,
  setFilter,
  isFooterVisible,
}) => {
  const allActiveTodo = todos.filter(todo => todo.completed === false).length;
  const existСompletedTodo = todos.some(todo => todo.completed === true);

  return (
    todos.length || isFooterVisible
      ? (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${allActiveTodo} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              data-cy="FilterLinkAll"
              href="#/"
              className={classNames(
                'filter__link',
                {
                  selected: filter === Filter.all,
                },
              )}
              onClick={() => {
                setFilter(Filter.all);
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
                  selected: filter === Filter.active,
                },
              )}
              onClick={() => {
                setFilter(Filter.active);
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
                  selected: filter === Filter.completed,
                },
              )}
              onClick={() => {
                setFilter(Filter.completed);
              }}
            >
              Completed
            </a>
          </nav>

          <button
            data-cy="ClearCompletedButton"
            type="button"
            className="todoapp__clear-completed"
            style={
              existСompletedTodo
                ? { opacity: 1, cursor: 'pointer' }
                : { opacity: 0, cursor: 'default' }
            }
            onClick={() => {
              onClearCompletedTodos();
            }}
          >
            Clear completed
          </button>
        </footer>
      ) : null
  );
};
