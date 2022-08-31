import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  todosLength: number,
  deleteCompleted: () => void,
  setFilterTodos: (filter: string) => void,
};

export const Footer: React.FC<Props> = ({
  todosLength, deleteCompleted, setFilterTodos,
}) => {
  const [filterLink, setFilerLink] = useState('all');

  setFilterTodos(filterLink);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todosLength} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link',
            { selected: filterLink === 'all' })}
          onClick={() => setFilerLink('all')}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link',
            { selected: filterLink === 'active' })}
          onClick={() => setFilerLink('active')}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterLink === 'completed' })}
          onClick={() => setFilerLink('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
