import React, { useMemo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  handleClearCompleted: () => void
  todos: Todo[];
};

export const ClearAllButton:React.FC<Props> = ({
  handleClearCompleted,
  todos,
}) => {
  const isSomeTodoCompleted = useMemo(
    () => todos.some(todo => todo.completed), [todos],
  );

  return (
    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      style={{ visibility: isSomeTodoCompleted ? 'visible' : 'hidden' }}
      onClick={handleClearCompleted}
    >
      Clear completed
    </button>
  );
};
