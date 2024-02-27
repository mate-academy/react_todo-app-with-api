import React, { useContext } from 'react';
import cn from 'classnames';
import { Status } from '../Types/Status';
import { DispatchContext, StateContext } from './TodosContext';
import { deleteTodo } from '../api/todos';

export const Footer: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { todos, filterBy } = useContext(StateContext);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleFilter = (status: Status) => {
    dispatch({
      type: 'filterBy',
      payload: status,
    });
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          dispatch({
            type: 'deleteTodo',
            payload: todo.id,
          });
        })
        .catch(() => {
          dispatch({
            type: 'hasError',
            payload: true,
          });
          dispatch({
            type: 'errorMessage',
            payload: 'Unable to delete a todo',
          });
        });
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length || 0} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterBy === Status.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilter(Status.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterBy === Status.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilter(Status.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterBy === Status.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilter(Status.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length <= 0 ? null : (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
