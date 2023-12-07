import React from 'react';
import { TodoFilter } from './TodoFilter';
import { EnumTodoFilter } from '../types';

interface Props {
  hasCompletedTodos: boolean;
  activeTodosCount: number;
  filter: EnumTodoFilter;
  onChangeFilter: (filter: EnumTodoFilter) => void;
  onDeleteCompletedTodos: () => void;
}

export const Footer: React.FC<Props> = ({
  hasCompletedTodos,
  activeTodosCount,
  filter,
  onChangeFilter,
  onDeleteCompletedTodos,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {`${activeTodosCount} items left`}
    </span>

    <TodoFilter filter={filter} onChangeFilter={onChangeFilter} />

    {hasCompletedTodos && (
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompletedTodos}
      >
        Clear completed
      </button>
    )}
  </footer>
);
