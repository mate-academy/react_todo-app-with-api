import React, { useContext } from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';
import { DispatchContext, StateContext } from '../../context/StateContext';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';

export const Footer: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { filter, todos, error } = useContext(StateContext);

  const handleFilterBy = (filterBy: Filter) => {
    dispatch({
      type: 'filterBy',
      payload: filterBy,
    });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    dispatch({
      type: 'loadingTodos',
      payload: completedTodos.map(todo => todo.id),
    });

    const promises = completedTodos.map(todo => {
      return deleteTodo(todo.id).then(() => todo);
    });

    const deleteResults = await Promise.allSettled(promises);
    let withError = false;

    const deletedTodos = deleteResults.reduce((acc: number[], result) => {
      if (result.status === 'rejected') {
        withError = true;

        return acc;
      }

      acc.push(result.value.id);

      return acc;
    }, []);

    dispatch({
      type: 'error',
      payload: withError ? Errors.todoDelete : error,
    });

    dispatch({
      type: 'setTodos',
      payload: todos.filter(todo => !deletedTodos.includes(todo.id)),
    });

    dispatch({
      type: 'loadingTodos',
      payload: [],
    });
  };

  const todosCounter = todos.filter(todo => !todo.completed).length;
  const hasAnyCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterBy(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterBy(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterBy(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasAnyCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
