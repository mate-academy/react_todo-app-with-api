import React, { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { Filters } from '../types/Filtres';
import { FilterButton } from './FilterButton';

type Props = {
  currentFilter: Filters;
  setCurrentFilter: Dispatch<SetStateAction<Filters>>;
  activeTodos: number;
  handleClearCompleted: MouseEventHandler<HTMLButtonElement>;
  disabledTodo: boolean;
};

export const Footer: React.FC<Props> = props => {
  const {
    activeTodos,
    disabledTodo,
    currentFilter,
    setCurrentFilter,
    handleClearCompleted,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filters).map(filterItem => (
          <FilterButton
            key={filterItem}
            filterItem={filterItem}
            setCurrentFilter={setCurrentFilter}
            currentFilter={currentFilter}
          />
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={disabledTodo}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
