import React from 'react';

import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

interface Props {
  todos: Todo[],
  filterType: FilterType,
  onSelect: (typeOfSort: FilterType) => void,
  onClearCompleted: () => void,
  hasCompletedTodos: boolean,
}

export const TodoFooter: React.FC<Props> = (props) => {
  const {
    todos,
    filterType,
    onSelect,
    onClearCompleted,
    hasCompletedTodos,
  } = props;

  const handlerSortSelect = (type: FilterType) => {
    if (type === filterType) {
      return;
    }

    onSelect(type);
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.length} items left`}
      </span>

      <nav className="filter">
        {Object.values(FilterType).map(type => (
          <a
            href={`#/${
              type === FilterType.ALL
                ? ''
                : type
            }`}
            className={classNames(
              'filter__link',
              {
                selected: filterType === type,
              },
            )}
            data-sort={type}
            onClick={() => handlerSortSelect(type)}
            key={type}
          >
            {type[0].toUpperCase() + type.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          {
            'is-invisible': !hasCompletedTodos,
          },
        )}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
