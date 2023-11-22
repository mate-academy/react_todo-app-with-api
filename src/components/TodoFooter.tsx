import cn from 'classnames';
import { useContext } from 'react';
import { Status } from '../types/Status';
import { TodoContext } from './TodoContext';

export const TodoFooter: React.FC = () => {
  const {
    todos, filter, setFilter, deleteTodo,
  } = useContext(TodoContext);

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const activeTodoCountMsg
    = `${activeTodoCount} ${activeTodoCount === 1 ? 'item' : 'items'} left`;

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const promises = completedTodos.map(todo => deleteTodo(todo.id));

    Promise.allSettled(promises);
  };

  if (!todos.length) {
    return <></>;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodoCountMsg}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            cn('filter__link', { selected: filter === Status.All })
          }
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            cn('filter__link', { selected: filter === Status.Active })
          }
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn('filter__link', { selected: filter === Status.Completed })
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>

    </footer>
  );
};
