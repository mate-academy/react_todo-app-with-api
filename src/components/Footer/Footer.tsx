import React, { memo } from 'react';
import { Filter } from '../Filter/Filter';
import { FilterType } from '../../types/Filter';

type Props = {
  filterType: string | FilterType;
  activeTodosAmount: number;
  isTodoCompleted: boolean;
  cleanCompletedTodos: () => void;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    filterType,
    activeTodosAmount,
    isTodoCompleted,
    cleanCompletedTodos,
    setFilterType,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosAmount} items left`}
      </span>

      <Filter
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {isTodoCompleted && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={cleanCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
