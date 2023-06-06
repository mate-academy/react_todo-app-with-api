import React from 'react';
import classNames from 'classnames';
import { ShowTodos } from '../../types/ShowTodos';

type Prop = {
  selectedTodos: ShowTodos,
  handleFilterSelect: (event: React.MouseEvent<HTMLAnchorElement>) => void,
};

export const Filter:React.FC<Prop> = React.memo(
  ({
    selectedTodos,
    handleFilterSelect,
  }) => {
    return (
      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            {
              selected: selectedTodos === ShowTodos.All,
            },
          )}
          onClick={handleFilterSelect}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            {
              selected: selectedTodos === ShowTodos.Active,
            },
          )}
          onClick={handleFilterSelect}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            {
              selected: selectedTodos === ShowTodos.Completed,
            },
          )}
          onClick={handleFilterSelect}
        >
          Completed
        </a>
      </nav>
    );
  },
);
