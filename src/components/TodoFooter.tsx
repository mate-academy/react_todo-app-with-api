import React from 'react';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  handleDeleteCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  handleDeleteCompleted,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const handleDatacy = (newFilter: Filter) => {
    switch (newFilter) {
      case Filter.All:
        return 'FilterLinkAll';

      case Filter.Active:
        return 'FilterLinkActive';

      default:
        return 'FilterLinkCompleted';
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map((filterItem: Filter) => (
          <a
            href={`#/${filterItem}`}
            className={classNames('filter__link', {
              selected: filter === filterItem,
            })}
            data-cy={handleDatacy(filterItem)}
            onClick={() => setFilter(filterItem)}
            key={filterItem}
          >
            {filterItem}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={handleDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
