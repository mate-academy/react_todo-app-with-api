import React from 'react';
import { TodoFilter } from '../TodoFilter/TodoFilter';
import { TodoStatusFilter } from '../../types/TodoStatusFilter';
// import { Todo } from '../../types/Todo';

type Props = {
  status: TodoStatusFilter,
  onSelectStatusFilter: (status: TodoStatusFilter) => void,
  uncompletedTodosCount: number,
  isVisibleClearCompleted: boolean,
  onRemoveAllCompletedTodos: () => void,
  // todos: Todo[],
  // onRemoveTodo: (todoId: number) => void,
};

export const TodoFooter: React.FC<Props> = React.memo(({
  status,
  onSelectStatusFilter,
  uncompletedTodosCount,
  isVisibleClearCompleted,
  onRemoveAllCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${uncompletedTodosCount} items left`}
      </span>

      <TodoFilter
        status={status}
        onSelectStatusFilter={onSelectStatusFilter}
      />

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onRemoveAllCompletedTodos}
        style={{ visibility: isVisibleClearCompleted ? 'visible' : 'hidden' }}
      >
        Clear completed
      </button>
    </footer>
  );
});
