import React from 'react';
import cn from 'classnames';
import { FilterOptions } from '../types/enums';

type Props = {
  filterTypeValue: FilterOptions;
  onSetfilterType: (value: FilterOptions) => void;
  handleDeleteCompleted: () => void;
  completedLength: number;
  notCompletedTodos: number;
};

const Footer: React.FC<Props> = ({
  filterTypeValue,
  onSetfilterType,
  handleDeleteCompleted,
  completedLength,
  notCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterTypeValue === FilterOptions.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            onSetfilterType(FilterOptions.All);
          }}
        >
          {FilterOptions.All}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterTypeValue === FilterOptions.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            onSetfilterType(FilterOptions.Active);
          }}
        >
          {FilterOptions.Active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterTypeValue === FilterOptions.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            onSetfilterType(FilterOptions.Completed);
          }}
        >
          {FilterOptions.Completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
        disabled={completedLength === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
