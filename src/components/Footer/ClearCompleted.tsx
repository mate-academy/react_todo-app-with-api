import React from 'react';

type Props = {
  completedTodosCount: number;
  onClearCompleted: () => void;
};

export const ClearCompleted: React.FC<Props> = ({
  completedTodosCount,
  onClearCompleted,
}) => (
  <button
    type="button"
    className="todoapp__clear-completed"
    data-cy="ClearCompletedButton"
    onClick={onClearCompleted}
    disabled={completedTodosCount === 0}
  >
    Clear completed
  </button>
);
