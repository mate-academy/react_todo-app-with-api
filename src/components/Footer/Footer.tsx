import classNames from 'classnames';
import { useMemo } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  filterBy: Status;
  isActive: Todo[];
  setFilterBy: React.Dispatch<React.SetStateAction<Status>>;
  deleteTodo: (id: number) => void;
}

export const Footer: React.FC<Props> = ({
  filterBy,
  isActive,
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
      <span className="todo-count">{`${isActive.length} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === Status.ALL,
          })}
          onClick={() => setFilterBy(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === Status.ACTIVE,
          })}
          onClick={() => setFilterBy(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Status.COMPLETED,
          })}
          onClick={() => setFilterBy(Status.COMPLETED)}
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
