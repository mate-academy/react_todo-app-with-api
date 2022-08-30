import React from 'react';
import classNames from 'classnames';

import { SortBy } from '../../Enums/SortBy';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  sortBy: number,
  setSortBy: CallableFunction,
  handleCompletedTodosClear: CallableFunction,
};

export const TodoAppFooter: React.FC<Props> = (props) => {
  const {
    todos,
    sortBy,
    setSortBy,
    handleCompletedTodosClear,
  } = props;

  const todosLeft = () => todos.filter(todo => !todo.completed).length;
  const completedTodos = () => todos.filter(todo => todo.completed).length;
  const handleSortBy = (sortByNumber: number) => setSortBy(sortByNumber);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLeft()} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: SortBy.All === sortBy,
            },
          )}
          onClick={() => handleSortBy(SortBy.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: SortBy.Active === sortBy,
            },
          )}
          onClick={() => handleSortBy(SortBy.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: SortBy.Completed === sortBy,
            },
          )}
          onClick={() => handleSortBy(SortBy.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleCompletedTodosClear()}
        style={{
          opacity: completedTodos() > 0 ? '100%' : '0%',
          cursor: completedTodos() > 0 ? 'pointer' : 'auto',
        }}
      >
        Clear completed
      </button>

    </footer>
  );
};
