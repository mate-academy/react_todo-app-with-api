import cn from 'classnames';
import { useContext } from 'react';
import { Filter } from '../types/Filter';
import { TodoContext } from './TodoContext';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    filter,
    setFilter,
    deleteTodo,
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
            cn('filter__link', { selected: filter === Filter.ALL })
          }
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            cn('filter__link', { selected: filter === Filter.ACTIVE })
          }
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            cn('filter__link', { selected: filter === Filter.COMPLETED })
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.COMPLETED)}
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
