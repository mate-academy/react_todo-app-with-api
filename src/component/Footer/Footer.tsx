import React, { useState } from 'react';
import cn from 'classnames';
import { FilterByWords } from '../../types/enums';

type Props = {
  setFilterHandler: (param: FilterByWords) => void;
  clearCompletedTodos: () => void;
  todoCounter: number;
  isCompletedTodos: boolean;
};

export const Footer: React.FC<Props> = ({
  setFilterHandler,
  todoCounter,
  isCompletedTodos,
  clearCompletedTodos,
}) => {
  const [selectedFilter, setSelectedFilter] = useState(FilterByWords.All);

  const handleFilterClick = (filter: FilterByWords) => {
    setSelectedFilter(filter);
    setFilterHandler(filter);
  };

  const handleClearClick = (filter: FilterByWords) => {
    clearCompletedTodos();
    setSelectedFilter(filter);
  };

  return (
    <>
      <span className="todo-count">{`${todoCounter} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: selectedFilter === FilterByWords.All })}
          onClick={() => handleFilterClick(FilterByWords.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: selectedFilter === FilterByWords.Active })}
          onClick={() => handleFilterClick(FilterByWords.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: selectedFilter === FilterByWords.Completed })}
          onClick={() => handleFilterClick(FilterByWords.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed')}
        style={{ visibility: !isCompletedTodos ? 'hidden' : 'visible' }}
        data-cy="ClearCompletedButton"
        onClick={() => handleClearClick(FilterByWords.Completed)}
      >
        Clear completed
      </button>
    </>
  );
};
