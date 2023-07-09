import React from 'react';
import { TodoFilter } from '../TodoFilter';

import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

interface Props {
  completedTodos: Todo[];
  activeTodos: Todo[];
  filterType: TodoStatus;
  onChangeFilter: (filter: TodoStatus) => void;
  handleClearCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  completedTodos,
  activeTodos,
  filterType,
  onChangeFilter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <TodoFilter filterType={filterType} onChangeFilter={onChangeFilter} />

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: completedTodos.length
            ? 'visible'
            : 'hidden',
        }}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
