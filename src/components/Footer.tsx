import classNames from 'classnames';
import { TodoState } from '../types/TodoState';
import { Todo } from '../types/Todo';

interface FooterProps {
  todos: Todo[],
  state: TodoState,
  setState: (value: TodoState) => void,
  clearCompleted: () => void,
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  state,
  setState,
  clearCompleted,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed).length;

  const handleAll = () => {
    setState(TodoState.All);
  };

  const handleActive = () => {
    setState(TodoState.Active);
  };

  const handleCompleted = () => {
    setState(TodoState.Completed);
  };

  const handleClearCompleted = () => {
    clearCompleted();
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: state === TodoState.All,
          })}
          onClick={handleAll}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: state === TodoState.Active,
          })}
          onClick={handleActive}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: state === TodoState.Completed,
          })}
          onClick={handleCompleted}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'todoapp__clear-completed--hidden': completedTodos < 1,
        })}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
