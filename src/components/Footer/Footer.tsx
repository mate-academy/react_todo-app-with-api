import React from 'react';
import { Filter } from '../Filter/Filter';
import { SortType } from '../../types/sortField';
import { FilterItem } from '../../types/filterItem';

type Props = {
  count: number;
  isDisabled: boolean;
  sortField: SortType;
  filterItems: FilterItem[];
  onDelete: () => void;
  onFilter: (field: SortType) => void;
};

export const Footer: React.FC<Props> = ({
  count,
  sortField,
  filterItems,
  isDisabled,
  onDelete,
  onFilter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {count} items left
      </span>

      <Filter
        sortField={sortField}
        filterItems={filterItems}
        onFilter={onFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDisabled}
        onClick={onDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
