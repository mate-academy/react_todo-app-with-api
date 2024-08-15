import classNames from 'classnames';
import { Todo, TodoStatus } from '../../types/todo';

type Props = {
  todos: Todo[];
  handleDeleteCompleted: () => void;
  status: TodoStatus;
  setStatus: (value: TodoStatus) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  handleDeleteCompleted,
  status,
  setStatus,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(TodoStatus).map(value => (
          <a
            key={value}
            href="#/"
            className={classNames('filter__link', {
              selected: status === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => setStatus(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
