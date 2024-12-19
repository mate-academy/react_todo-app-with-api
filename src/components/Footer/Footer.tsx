import { FC, Dispatch, SetStateAction } from 'react';
import { FilterOptions } from '../../types/FilterOptions';
import cn from 'classnames';

interface Props {
  filterOption: FilterOptions;
  numberOfActiveTodos: number;
  setFilterOption: Dispatch<SetStateAction<FilterOptions>>;
  completedTodosId: number[];
  onDeleteTodos: (idsForDelete: number[]) => void;
}

export const Footer: FC<Props> = ({
  numberOfActiveTodos,
  setFilterOption,
  filterOption,
  completedTodosId,
  onDeleteTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {numberOfActiveTodos} items left
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
        disabled={!completedTodosId.length}
        onClick={() => onDeleteTodos(completedTodosId)}
      >
        Clear completed
      </button>
    </footer>
  );
};
