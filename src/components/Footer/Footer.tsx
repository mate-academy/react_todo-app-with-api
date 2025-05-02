import React from 'react';
import { Filter } from './Filter';
import { ClearCompleted } from './ClearCompleted';
import { FilterStatus } from '../../types/Todo';

type Props = {
  todosLength: number;
  activeTodosCount: number;
  completedTodosCount: number;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todosLength,
  activeTodosCount,
  completedTodosCount,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const itemsLeftText = `${activeTodosCount} item${activeTodosCount !== 1 ? 's' : ''} left`;

  return (
    todosLength > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {itemsLeftText}
        </span>

        <Filter filter={filter} setFilter={setFilter} />

        <ClearCompleted
          completedTodosCount={completedTodosCount}
          onClearCompleted={onClearCompleted}
        />
      </footer>
    )
  );
};
