import { useContext } from 'react';
import cn from 'classnames';

import { Filter } from '../../types/Filter';
import { TodoContext } from '../../contexts/TodoContext';
import { deleteTodoApi } from '../../api/todos';
import { UNABLE_TO_DELETE_ERROR } from '../../constants/errors';

export const Footer: React.FC = () => {
  const {
    todos,
    deleteTodoHandler,
    setUpdatingTodosIdsHandler,
    setErrorHandler,
    filter,
    setFilterHandler,
  } = useContext(TodoContext);

  const activeTodosAmount = todos.filter(({ completed }) => !completed).length;

  const completedTodosIds = todos
    .filter(({ completed }) => completed)
    .map(({ id }) => id);

  const clearCompletedTodosHandler = () => {
    setErrorHandler('');

    completedTodosIds.forEach(id => {
      setUpdatingTodosIdsHandler(id);
      deleteTodoApi(id)
        .then(() => deleteTodoHandler(id))
        .catch(() => {
          setErrorHandler(UNABLE_TO_DELETE_ERROR);
        })
        .finally(() => setUpdatingTodosIdsHandler(null));
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosAmount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterHandler(Filter.All)}
        >
          {Filter.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterHandler(Filter.Active)}
        >
          {Filter.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterHandler(Filter.Completed)}
        >
          {Filter.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompletedTodosHandler}
        disabled={!completedTodosIds.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
