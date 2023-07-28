import classNames from 'classnames';
import { useMemo } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filterBy: Status;
  activeTodos: Todo[];
  setFilterBy: React.Dispatch<React.SetStateAction<Status>>;
  deleteTodo: (id: number) => void;
}

export const Footer: React.FC<Props> = ({
  filterBy,
  activeTodos,
  setFilterBy,
  deleteTodo,
  todos,
}) => {
  const handleClearCompleted = () => {
    todos.forEach((todo) => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }
    });
  };

  const todosCompleted = useMemo(() => todos
    .filter(({ completed }) => completed), [todos]);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${activeTodos.length} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === Status.All,
          })}
          onClick={() => setFilterBy(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === Status.Active,
          })}
          onClick={() => setFilterBy(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Status.Completed,
          })}
          onClick={() => setFilterBy(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClearCompleted}
      >
        {!!todosCompleted.length && 'Clear completed'}
      </button>
    </footer>
  );
};
