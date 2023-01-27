import React, { memo } from 'react';
import { FilterType } from '../../types/FilterType';
import { Filter } from '../Filter';

type Props = {
  amountOfActiveTodos: number;
  hasCompletedTodos: boolean;
  filterType: FilterType;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
  setIsRemoveCompleted:() => void;
};

export const Footer: React.FC<Props> = memo(({
  amountOfActiveTodos,
  hasCompletedTodos,
  filterType,
  setFilterType,
  setIsRemoveCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${amountOfActiveTodos} items left`}
      </span>

      <Filter
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {hasCompletedTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => setIsRemoveCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
