import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';
import { Filters } from '../../types/enums';

type Props = {
  prepariedTodos: Todo[];
  itemsLeft: Todo[];
  filterMethod: Filters;
  setFilterMethod: React.Dispatch<React.SetStateAction<Filters>>;
  handleDeletingTodos: () => void;
};

const FooterComponent: React.FC<Props> = ({
  prepariedTodos,
  itemsLeft,
  filterMethod,
  setFilterMethod,
  handleDeletingTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterMethod === Filters.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterMethod(Filters.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterMethod === Filters.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterMethod(Filters.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterMethod === Filters.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterMethod(Filters.completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeletingTodos}
        disabled={prepariedTodos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);
