import React from 'react';
import classNames from 'classnames';
import { clearCompleted, FilterEnum, filterTodos } from '../../api/todos';
import { useAppContext } from '../../HooksContext';

export const Footer: React.FC = () => {
  const {
    allTodos,
    setAllTodos,
    selectedFilter,
    setSelectedFilter,
    setErrorMessage,
    setLoading,
  } = useAppContext();

  const filterClick = (curFilter: FilterEnum) => {
    return () => {
      if (selectedFilter === curFilter) {
        return;
      }

      setSelectedFilter(curFilter);
      filterTodos(curFilter, allTodos);
    };
  };

  const completedLentgh = allTodos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${completedLentgh} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterEnum).map((curFilter, index) => {
          return (
            <a
              data-cy={`FilterLink${curFilter.charAt(0).toUpperCase() + curFilter.slice(1)}`}
              key={index}
              href={curFilter === FilterEnum.ALL ? '#/' : `#/${curFilter}`}
              className={classNames('filter__link', {
                selected: selectedFilter === curFilter,
              })}
              onClick={filterClick(curFilter)}
            >
              {curFilter.charAt(0).toUpperCase() + curFilter.slice(1)}
            </a>
          );
        })}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!allTodos.some(todo => todo.completed)}
        onClick={clearCompleted(
          allTodos,
          setAllTodos,
          setErrorMessage,
          setLoading,
        )}
      >
        Clear completed
      </button>
    </footer>
  );
};
