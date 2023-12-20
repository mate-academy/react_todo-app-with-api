import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalContex } from '../TodoContext';
import { Filter } from '../types/Filter';
import { TodoErrors } from '../types/TodoErrors';
import { Todo } from '../types/Todo';

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

  const [deletedTodos, setDeletedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setIsCompletedRemoving(false);
    setIsTitleOnFocus(true);
    setTodos(todos.filter(todo => !deletedTodos.includes(todo)));
  }, [deletedTodos]);

  const handleFilterClick = (selectedFilter: Filter) => {
    setFilter(selectedFilter);
  };

  const handleClearTodosClick = () => {
    setIsCompletedRemoving(true);
    setIsTitleOnFocus(false);

    todos
      .filter(todo => todo.completed)
      .forEach(async (todo) => {
        const res = await deleteTodoItem(todo.id);

        if (res) {
          setDeletedTodos((previousItems: Todo[]) => [...previousItems, todo]);
        } else {
          setError(TodoErrors.Delete);
        }
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

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearTodosClick}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};
