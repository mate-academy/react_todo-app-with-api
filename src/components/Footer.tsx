import { useContext } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../contexts/TodoContext';
import { deleteTodo } from '../api/todos';
import { Filtering } from '../types/Filtering';

export const Footer = () => {
  const {
    todos,
    setTodos,
    filtering,
    setFiltering,
    setLoadingAllTodos,
    setErrorMessage,
  } = useContext(TodoContext);

  const completedTodosIds = todos.filter(todo => todo.completed).map(t => t.id);

  const itemsLeft = todos.reduce((acc, t) => {
    if (!t.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const handleCatch = () => {
    setLoadingAllTodos(false);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleDelete = ((ids: number[]) => {
    setLoadingAllTodos(true);

    Promise.all(ids.map(id => deleteTodo(id)))
      .then(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => handleCatch());
  });

  const hasCompleted = todos.some(t => t.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: Filtering.ALL === filtering },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFiltering(Filtering.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: Filtering.ACTIVE === filtering },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setFiltering(Filtering.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: Filtering.COMPLETED === filtering },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setFiltering(Filtering.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => handleDelete(completedTodosIds)}
      >
        Clear completed
      </button>
    </footer>
  );
};
