import classNames from 'classnames';
import React, { useContext } from 'react';
import { GlobalContex } from '../TodoContext';
import { Filter } from '../types/Filter';
import { TodoErrors } from '../types/TodoErrors';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    filter,
    setFilter,
    deleteTodoItem,
    setIsCompletedRemoving,
    setError,
    setIsTitleOnFocus,
  } = useContext(GlobalContex);

  const handleFilterClick = (selectedFilter: Filter) => {
    setFilter(selectedFilter);
  };

  const handleClearTodosClick = () => {
    setIsCompletedRemoving(true);
    setIsTitleOnFocus(false);

    const deletingTodos = todos
      .filter(todo => todo.completed)
      .map(todo => deleteTodoItem(todo.id));

    Promise.all(deletingTodos)
      .then(() => {
        setTodos(todos.filter(todo => !todo.completed));
      })
      .catch(() => setError(TodoErrors.Delete))
      .finally(() => {
        setIsCompletedRemoving(false);
        setIsTitleOnFocus(true);
      });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => handleFilterClick(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => handleFilterClick(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => handleFilterClick(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {todos.some(todo => todo.completed) && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearTodosClick}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
