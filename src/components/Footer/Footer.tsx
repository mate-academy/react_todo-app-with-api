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
        {(Object.values(FilterTypes)).map((key) => {
          return (
            <a
              href={`#/${key}`}
              className={cn('filter__link', {
                selected: key === filterType,
              })}
              onClick={() => handleFilterType(key as FilterTypes)}
            >
              {key}
            </a>
          );
        })}
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
