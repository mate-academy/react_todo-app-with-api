import classNames from 'classnames';
import { Filter, Todo } from '../types/Todo';

type Props = {
  activeTodos: Todo[],
  filter: string,
  onSetFilter: (filter: string) => void,
  handleRemoveTodo: (selectedTodosIds: number) => void
  completedTodos: Todo[]
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  onSetFilter,
  filter,
  handleRemoveTodo,
  completedTodos,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodos.length} items left`}
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filter === Filter.ALL },
        )}
        onClick={() => {
          onSetFilter(Filter.ALL);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filter === Filter.ACTIVE },
        )}
        onClick={() => {
          onSetFilter(Filter.ACTIVE);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filter === Filter.COMPLETED },
        )}
        onClick={() => {
          onSetFilter(Filter.COMPLETED);
        }}
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      onClick={() => {
        completedTodos.forEach((todo) => {
          handleRemoveTodo(todo.id);
        });
      }}
      style={{
        visibility: completedTodos.length
          ? ('visible')
          : ('hidden'),
      }}
    >
      Clear completed
    </button>

  </footer>
);
