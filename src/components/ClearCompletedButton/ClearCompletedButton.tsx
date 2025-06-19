import React from 'react';

interface Props {
  deleteCompletedTodos: () => void;
  hasCompletedTodos: boolean;
}

export const ClearCompletedButton: React.FC<Props> = React.memo(
  ({ deleteCompletedTodos, hasCompletedTodos }) => {
    return (
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteCompletedTodos()}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    );
  },
);

ClearCompletedButton.displayName = 'ClearCompletedButton';
