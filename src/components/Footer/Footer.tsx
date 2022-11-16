import classNames from 'classnames';
import React from 'react';
import { FieldForFiltering } from '../../types/Todo';

type Props = {
  fieldForFiltering: FieldForFiltering;
  selectFieldForFiltering: (field: FieldForFiltering) => void;
  counterActiveTodos: number;
  deleteCompletedTodos: () => void;
  length: number;
};

export const Footer: React.FC<Props> = React.memo(({
  fieldForFiltering,
  selectFieldForFiltering: selectFieldForSorting,
  counterActiveTodos,
  deleteCompletedTodos,
  length,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${counterActiveTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames('filter__link', {
            selected: fieldForFiltering === FieldForFiltering.All,
          })}
          onClick={() => selectFieldForSorting(FieldForFiltering.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames('filter__link', {
            selected: fieldForFiltering === FieldForFiltering.Active,
          })}
          onClick={() => selectFieldForSorting(FieldForFiltering.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames('filter__link', {
            selected: fieldForFiltering === FieldForFiltering.Completed,
          })}
          onClick={() => selectFieldForSorting(FieldForFiltering.Completed)}
        >
          Completed
        </a>
      </nav>

      {length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => deleteCompletedTodos()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
