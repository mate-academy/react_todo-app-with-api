import React from 'react';

type Props = {
  handleClearCompleted: () => void
};

export const ClearAllButton:React.FC<Props> = ({ handleClearCompleted }) => (
  <button
    data-cy="ClearCompletedButton"
    type="button"
    className="todoapp__clear-completed"
    onClick={handleClearCompleted}
  >
    Clear completed
  </button>
);
