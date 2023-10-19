import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[],
  changeSelectFilter: (sortType: FilterType) => void,
  selectFilter: string,
  handleClearCopmpletedTodo: () => void,
};

export const Footer: React.FC<Props> = (
  {
    todos,
    changeSelectFilter,
    selectFilter,
    handleClearCopmpletedTodo,
  },
) => {
  const clearCompleteStatusButton = todos.some((todo) => todo.completed);

  const itemsLeftCounter = todos.reduce((acc, todo) => {
    const { completed } = todo;

    if (!completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeftCounter <= 1
          ? `${itemsLeftCounter} item left`
          : `${itemsLeftCounter} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map((sortType) => (
          <a
            key={sortType}
            onClick={() => changeSelectFilter(sortType)}
            href={`#/${selectFilter === 'All' ? '' : sortType}`}
            className={cn('filter__link',
              { selected: selectFilter === sortType })}
            data-cy="FilterLinkAll"
          >
            {sortType}
          </a>
        ))}
      </nav>

      <button
        onClick={handleClearCopmpletedTodo}
        disabled={!clearCompleteStatusButton}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
      >
        Clear completed
      </button>
    </footer>
  );
};
