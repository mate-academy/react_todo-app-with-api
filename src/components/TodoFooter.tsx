import React from 'react';
import { FilterType } from '../types/FilterType';
import { TodoFilter } from './TodoFilter';
import { MAIN_PHRASES } from '../constants';
import { getNoun, interpolate } from '../utils';

function getItemsLeftText(count: number) {
  return interpolate(MAIN_PHRASES.footerItemsLeft, {
    count,
    noun: getNoun(count, [MAIN_PHRASES.nounItem, MAIN_PHRASES.nounItems]),
  });
}

interface Props {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onDeleteCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  filter,
  onFilterChange,
  onDeleteCompleted,
}) => {
  const hasCompletedTodos = completedTodosCount > 0;
  const itemsLeft = getItemsLeftText(activeTodosCount);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft}
      </span>

      <TodoFilter filter={filter} onFilterChange={onFilterChange} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onDeleteCompleted}
      >
        {MAIN_PHRASES.buttonClearCompleted}
      </button>
    </footer>
  );
};
