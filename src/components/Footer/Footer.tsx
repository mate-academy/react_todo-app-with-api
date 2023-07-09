import React from 'react';
import { Filter } from '../TodoFilter/TodoFilter';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

interface Props {
  completedTodos: Todo[];
  activeTodos: Todo[];
  filter: TodoStatus;
  onFilterChange: (filter: TodoStatus) => void;
  handleClearCompletedTodos: () => void;
}

export const Footer: React.FC<Props> = ({
  completedTodos,
  activeTodos,
  filter,
  onFilterChange,
  handleClearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <Filter filter={filter} onFilterChange={onFilterChange} />

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: completedTodos.length
            ? 'visible'
            : 'hidden',
        }}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
