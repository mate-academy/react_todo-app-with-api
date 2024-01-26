import cn from 'classnames';
import './Footer.scss';
import { useContext } from 'react';
import { DispatchContext, StateContext } from '../../State/State';
import { Filter } from '../../types/Filter';
import { deleteAllCompleted } from '../../api/todos';

export const Footer = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, filterBy } = useContext(StateContext);

  const hasCompleted = todos.some(todo => todo.completed);
  const activeTodos = todos.filter(el => !el.completed).length;

  function handleDeleteAllCompleted() {
    dispatch({ type: 'clearAll', payload: true });

    deleteAllCompleted(todos)
      .then(() => dispatch({ type: 'deleteAllCompleted' }))
      .catch(() => dispatch(
        { type: 'setError', payload: 'Unable to delete a todos' },
      ))
      .finally(() => dispatch({ type: 'clearAll', payload: false }));
  }

  return (
    // {/* Hide the footer if there are no todos */}
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      {!!todos.length && (
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={cn('filter__link', {
              selected: filterBy === Filter.all,
            })}
            data-cy="FilterLinkAll"
            onClick={() => dispatch({ type: 'setFilter', payload: Filter.all })}
          >
            All
          </a>

          <a
            href="#/active"
            className={cn('filter__link', {
              selected: filterBy === Filter.active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => dispatch({
              type: 'setFilter',
              payload: Filter.active,
            })}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cn('filter__link', {
              selected: filterBy === Filter.completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => dispatch({
              type: 'setFilter',
              payload: Filter.completed,
            })}
          >
            Completed
          </a>
        </nav>
      )}

      {/* don't show this button if there are no completed todos */}
      {hasCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteAllCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
