import React from 'react';
import { Todo } from './types/Todo';
import { FilterType } from './types/filterEnum';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
  loadingTodo: number | null;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  clearCompleted,
  loadingTodo,
}) => {
  const activeTodosCount = todos.filter(
    todo => !todo.completed && todo.id !== loadingTodo,
  ).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const filterDataCyMap: Record<FilterType, string> = {
    [FilterType.All]: 'FilterLinkAll',
    [FilterType.Active]: 'FilterLinkActive',
    [FilterType.Completed]: 'FilterLinkCompleted',
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filterType => (
          <a
            key={filterType}
            href={`#/${filterType.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filter === filterType,
            })}
            onClick={() => setFilter(filterType)}
            data-cy={filterDataCyMap[filterType]}
          >
            {filterType}
          </a>
        ))}
      </nav>
      <button
        className={classNames('todo__clear-completed', {
          'todoapp__clear-completed--hidden': completedTodosCount === 0,
        })}
        onClick={clearCompleted}
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear Completed
      </button>
    </footer>
  );
};
