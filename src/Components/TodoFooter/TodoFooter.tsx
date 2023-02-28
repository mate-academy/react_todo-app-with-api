import React from 'react';
import classNames from 'classnames';
import { capitalizeFirstLetter } from '../../helpers/capitalizeFirstLetter';

import { FilterType } from '../../enums/FilterType';

type Props = {
  activeTodosNum: number;
  counterCompletedTodos: number;
  selectFilter: FilterType;
  onSelectFilter: (newFilter: FilterType) => void;
  onClearCompleted: () => void;
};

const filterOptions = Object.values(FilterType);

export const TodoFooter: React.FC<Props> = React.memo(({
  activeTodosNum,
  counterCompletedTodos,
  selectFilter,
  onSelectFilter,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">{`${activeTodosNum} items left`}</span>

    <nav className="filter">
      {filterOptions.map((option) => (
        <a
          key={option}
          href={`#/${option}`}
          className={classNames('filter__link', {
            selected: option === selectFilter,
          })}
          onClick={() => onSelectFilter(option)}
        >
          {capitalizeFirstLetter(option)}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className={classNames('todoapp__clear-completed', {
        hidden: !counterCompletedTodos,
      })}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
));
