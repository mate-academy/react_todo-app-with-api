import { Todo } from '../types/Todo';
import { TodoStatus } from '../App';
import classNames from 'classnames';

interface FooterProps {
  filter: TodoStatus;
  setFilter: (filter: TodoStatus) => void;
  todos: Todo[];
  onClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  setFilter,
  todos,
  onClick,
}) => {
  const todoStatuses = Object.values(TodoStatus);
  const activeTodo = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodo} {activeTodo === 1 ? 'item' : 'items'} left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {todoStatuses.map((status) => (
          <a
          key={status}
          href={`#/${status.toLowerCase()}`}
          className={classNames('filter__link', { selected: filter === status, })}
          data-cy={`FilterLink${status}`}
          onClick={() => setFilter(status)}
        >
          {status}
        </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClick}
        disabled={completedTodos <= 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
