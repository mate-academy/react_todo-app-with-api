import React from 'react';
import cn from 'classnames';

import { Filter } from '../Filter';
import { FilterOptions } from '../../types/FilterOptions';
import { Todo } from '../../types/Todo';

type Props = {
  filter: FilterOptions;
  setFilter: (value: FilterOptions) => void;
  activeTodos: Todo[];
  completedTodos: Todo[];
  handleDeleteCompletedButton: () => void;
};

export const Footer:React.FC<Props> = ({
  filter,
  setFilter,
  activeTodos,
  completedTodos,
  handleDeleteCompletedButton,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <Filter filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          hidden: completedTodos.length === 0,
        })}
        onClick={handleDeleteCompletedButton}
      >
        Clear completed
      </button>
    </footer>
  );
};
