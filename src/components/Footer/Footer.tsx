import React, { Dispatch, SetStateAction, useState } from 'react';
import classNames from 'classnames';
import { FilterOptions } from '../../types/FilterOptions';

type Props = {
  setFilterType: Dispatch<SetStateAction<FilterOptions>>
  deleteCompletedTodos: () => void,
  isSomeTodosCompleted: boolean,
  amountOfActive: number,
};

export const Footer: React.FC<Props> = React.memo(({
  setFilterType,
  isSomeTodosCompleted,
  deleteCompletedTodos,
  amountOfActive,
}) => {
  const [selectedOption, setSelectedOption] = useState<FilterOptions>(
    FilterOptions.All,
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${amountOfActive} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterOptions).map(option => (
          <a
            key={option}
            href={`#/${option.toLowerCase()}`}
            className={classNames(
              'filter__link',
              { selected: selectedOption === option },
            )}
            onClick={() => {
              setFilterType(option);
              setSelectedOption(option);
            }}
          >
            {option}
          </a>
        ))}
      </nav>

      {isSomeTodosCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteCompletedTodos}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
});
