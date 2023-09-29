import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useTodosContext } from '../../providers/TodosProvider/TodosProvider';

export const Filter = () => {
  const {
    todos, handleFilter, filter, delTodo, uploading,
  } = useTodosContext();
  const [counter, setCounter] = useState<number>(
    todos.filter(todo => todo.completed === false).length,
  );

  useEffect(() => {
    if (uploading.length === 0) {
      setCounter(todos.filter(todo => !todo.completed).length);
    }
  }, [todos, uploading]);

  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counter} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === 'all',
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilter('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilter('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        style={todos.every(todo => todo.completed === false)
          ? { visibility: 'hidden' }
          : {}}
        onClick={() => {
          todos.filter(todo => todo.completed === true)
            .forEach(completed => delTodo(completed));
        }}
        disabled={todos.every(todo => todo.completed === false)}
      >
        Clear completed
      </button>

    </footer>
  );
};
