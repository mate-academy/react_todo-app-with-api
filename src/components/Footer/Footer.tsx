import classNames from 'classnames';
import { useContext } from 'react';
import { DispatchContext, StateContext } from '../../context/TodosContext';
import { Status } from '../../types/Status';

type Props = {
  handleDelete: (deletingPostId: number) => void;
};

export const Footer: React.FC<Props> = ({ handleDelete }) => {
  const { todos, status } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const isAnyCompletedTodo = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const deletingTodos = todos.filter(todo => todo.completed);

    deletingTodos.forEach(todo => handleDelete(todo.id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: !status,
          })}
          data-cy="FilterLinkAll"
          onClick={() => dispatch({ type: Status.All })}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => dispatch({ type: Status.Active })}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => dispatch({ type: Status.Completed })}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyCompletedTodo}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
