import classNames from "classnames";
import { StatusTodo } from "../../types/StatusTodo";
import { Todo } from "../../types/Todo";

type Props = {
  activeTodos: Todo[],
  completedTodos: Todo[],
  statusTodos: StatusTodo,
  setStatusTodos: (status: StatusTodo) => void,
  onDelete: (id: number) => void,
}

export const Footer: React.FC<Props> = (props) => {
  const {
    activeTodos,
    completedTodos,
    statusTodos,
    setStatusTodos,
    onDelete,
  } = props;

  const handleRemoveCompleted = async () => {
    await Promise.all(completedTodos.map(todo => onDelete(todo.id)));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            {
              // eslint-disable-next-line
              'selected': statusTodos === StatusTodo.ALL,
            })}
          onClick={() => {
            setStatusTodos(StatusTodo.ALL);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            {
              // eslint-disable-next-line
              'selected': statusTodos === StatusTodo.ACTIVE
            })}
          onClick={() => {
            setStatusTodos(StatusTodo.ACTIVE);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            {
              // eslint-disable-next-line
              'selected': statusTodos === StatusTodo.COMPLETED
            })}
          onClick={() => {
            setStatusTodos(StatusTodo.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames('todoapp__clear-completed',
          {
            'todoapp__clear-completed--hidden': !completedTodos.length,
          })}
        onClick={handleRemoveCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
