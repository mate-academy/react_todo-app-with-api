import React from 'react';

type ClearCompletedButtonProps = {
  onClearCompleted: () => void;
  isDisabled: boolean;
};

export const ClearCompletedButton: React.FC<ClearCompletedButtonProps> = ({
  onClearCompleted,
  isDisabled,
}) => {
  return (
    <button
      type="button"
      data-cy="ClearCompletedButton"
      className="todoapp__clear-completed"
      onClick={onClearCompleted}
      disabled={isDisabled}
    >
      Clear completed
    </button>
  );
};
