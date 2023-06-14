import React from 'react';
import { Filter } from '../TodoFilter';

import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

interface Props {
  completedTodos: Todo[];
  activeTodos: Todo[];
  filter: TodoStatus;
  onChangeFilter: (filter: TodoStatus) => void;
  handleClearCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  completedTodos,
  activeTodos,
  filter,
  onChangeFilter,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <Filter filter={filter} onChangeFilter={onChangeFilter} />

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
