import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';

type Props = {
  onChangeFilter: (value: FilterBy) => void;
  filterSelected: FilterBy;
  activeTodos: number;
  completedTodos: number;
  clearCompleted: () => void;
};

function getProperty<T, K extends keyof T>(
  obj: T, key: K,
): T[K] {
  return obj[key];
}

export const TodoFooter: React.FC<Props> = ({
  onChangeFilter,
  filterSelected,
  activeTodos,
  completedTodos,
  clearCompleted,
}) => {
  const filterButtons = Object.values(FilterBy).map(k => {
    return getProperty(FilterBy, k);
  });

  const onChangeFilterType = (f: keyof typeof FilterBy) => {
    onChangeFilter(getProperty(FilterBy, f));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter">
        {filterButtons.map(button => (
          <a
            key={button}
            href={`#/${button === FilterBy.all ? '' : `${button}`}`}
            className={cn(
              'filter__link',
              { selected: button === filterSelected },
            )}
            onClick={() => onChangeFilterType(button)}
          >
            {button}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos === 0}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
