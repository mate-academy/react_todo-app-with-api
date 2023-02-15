import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Filter } from '../../types/Filter';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[] | null;
  selectFilter: Filter;
  switchFilter: (selector: Filter) => void;
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  selectFilter,
  switchFilter,
  clearCompleted,
}) => {
  const [hasIncompleteTodos, setHasIncompleteTodos] = useState(false);

  useEffect(() => {
    if (todos?.some((todo) => todo.completed)) {
      setHasIncompleteTodos(true);
    } else {
      setHasIncompleteTodos(false);
    }
  });

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${todos?.length} items left`}</span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: selectFilter === Filter.all,
          })}
          onClick={() => switchFilter(Filter.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: selectFilter === Filter.active,
          })}
          onClick={() => switchFilter(Filter.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: selectFilter === Filter.completed,
          })}
          onClick={() => switchFilter(Filter.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={clearCompleted}
        style={{
          visibility: hasIncompleteTodos ? 'visible' : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
