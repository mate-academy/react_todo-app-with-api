import { useMemo } from 'react';
import cn from 'classnames';
import { useTodoContext } from '../contexts/TodoContext';
import { Sorting } from '../types/Sorting';
import { deleteTodo } from '../api/todos';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    filter,
    setError,
    setFilter,
  } = useTodoContext();

  const activeTodos = useMemo(() => (
    todos.filter((todo) => !todo.completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter((todo) => todo.completed)
  ), [todos]);

  const deleteCompleted = () => {
    const completedTodosIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    Promise.all(completedTodosIds.map((id) => deleteTodo(id)))
      .then(() => {
        setTodos(todos.filter((todo) => !todo.completed));
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filter === 'all' })}
          onClick={() => setFilter(Sorting.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === 'active' })}
          onClick={() => setFilter(Sorting.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === 'completed' })}
          onClick={() => setFilter(Sorting.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompleted}
        style={{ color: completedTodos.length > 0 ? 'inherit' : 'transparent' }}
      >
        Clear completed
      </button>
    </footer>
  );
};
