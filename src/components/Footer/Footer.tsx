import cn from 'classnames';
import React, { useContext } from 'react';
import { FilterTypes } from '../../types/FIlterTypes';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosProvider';

type Props = {
  filterType: FilterTypes,
  handleFilterType: (filter: FilterTypes) => void,
  activeTodos: Todo[],
};

export const Footer: React.FC<Props> = React.memo(({
  filterType,
  handleFilterType,
  activeTodos,
}) => {
  const { completedTodos, deleteAllCompleted } = useContext(TodosContext);
  const hasCompletedTodos = completedTodos.length > 0;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: FilterTypes.ALL === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: FilterTypes.ACTIVE === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: FilterTypes.COMPLETED === filterType,
          })}
          onClick={() => handleFilterType(FilterTypes.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': !hasCompletedTodos,
        })}
        onClick={() => deleteAllCompleted()}
      >
        Clear completed
      </button>
    </footer>
  );
});
