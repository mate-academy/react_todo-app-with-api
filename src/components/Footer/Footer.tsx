import React from 'react';
import cn from 'classnames';
import { TodoType } from '../../types/TodoType';
import { FilterOptions } from '../../types/FilterOptions';

type FooterProps = {
  todos: TodoType[];
  filterOption: FilterOptions;
  setFilterOption: (value: React.SetStateAction<FilterOptions>) => void;
  handleClearCompletedTodos: () => void;
  setFocusInput: React.Dispatch<React.SetStateAction<number>>;
};

export const Footer: React.FC<FooterProps> = ({
  todos,
  filterOption,
  setFilterOption,
  handleClearCompletedTodos,
  setFocusInput,
}) => {
  const isClearButtonDisabled = !todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterOption === FilterOptions.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilterOption(FilterOptions.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterOption === FilterOptions.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilterOption(FilterOptions.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterOption === FilterOptions.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterOption(FilterOptions.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          handleClearCompletedTodos();
          setFocusInput(prev => prev + 1);
        }}
        disabled={isClearButtonDisabled}
      >
        Clear completed
      </button>
    </footer>
  );
};
