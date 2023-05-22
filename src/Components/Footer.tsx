import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  setFilter: (filter: string) => void;
  filter: string;
  onDeleteCompleted: () => void;
  selectedTodos: Todo[];
}

export const Footer: React.FC<Props> = ({
  todos,
  setFilter,
  filter,
  onDeleteCompleted,
  selectedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          onClick={() => setFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          onClick={() => setFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      {selectedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={() => onDeleteCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
