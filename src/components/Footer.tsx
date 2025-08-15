import React from 'react';
import { Filter } from './Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  incompleteCount: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
  onToggleAll: () => void;
  allCompleted: boolean;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  setFilter,
  incompleteCount,
  hasCompleted,
  onClearCompleted,
  onToggleAll,
  allCompleted,
}) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${incompleteCount} item${incompleteCount !== 1 ? 's' : ''} left`}
      </span>

      <Filter filter={filter} setFilter={setFilter} />

      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        data-cy="ToggleAllButton"
        onClick={onToggleAll}
      />

      <button
        type="button"
        className={`todoapp__clear-completed ${!hasCompleted ? 'hidden' : ''}`}
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
