import { Dispatch, SetStateAction } from 'react';
import { Filters } from '../../types/Todo';
import { Filter } from '../Filter';

type FooterProps = {
  filterBy: Filters;
  activeTodosLength: number;
  onFilterChange: Dispatch<SetStateAction<Filters>>;
  isDisabled: boolean;
  onMassiveDelete: () => void;
};

export function Footer({
  filterBy,
  activeTodosLength,
  isDisabled,
  onFilterChange,
  onMassiveDelete,
}: FooterProps) {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosLength} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <Filter filterBy={filterBy} onFilterChange={onFilterChange} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onMassiveDelete}
        disabled={isDisabled}
      >
        Clear completed
      </button>
    </footer>
  );
}
