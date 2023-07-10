import React from 'react';
import classNames from 'classnames';
import { Filter } from '../Filter';
import { Todo } from '../../types/Todo';
import { FilteringOption } from '../../types/Filter';

interface Props {
  filter: FilteringOption;
  setFilter: (filter: FilteringOption) => void;
  activeTodos: Todo[];
  completedTodos: Todo[];
  handleClearCompletedTodos: () => Promise<void>;
}

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  activeTodos,
  completedTodos,
  handleClearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <Filter filter={filter} setFilter={setFilter} />

      {completedTodos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__clear-completed', {
            hidden: completedTodos.length === 0,
          })}
          onClick={handleClearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
