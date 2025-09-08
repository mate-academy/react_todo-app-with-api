import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filters } from '../../types/enums';

type Props = {
  todos: Todo[];
  items: Todo[];
  filter: Filters;
  setFilter: React.Dispatch<React.SetStateAction<Filters>>;
  handleDeleteCompleteTodo: () => void;
};

const FooterComponent: React.FC<Props> = ({
  todos,
  items,
  filter,
  setFilter,
  handleDeleteCompleteTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {items.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === Filters.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filters.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === Filters.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filters.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === Filters.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filters.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleteTodo}
        disabled={!todos.some(todo => todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);
