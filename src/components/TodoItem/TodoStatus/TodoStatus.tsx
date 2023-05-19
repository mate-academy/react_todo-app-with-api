import React from 'react';

interface Props {
  checked: boolean;
  handleCompleteStatusChange: (checked: boolean) => void;
}

export const TodoStatus: React.FC<Props> = React.memo(({
  checked,
  handleCompleteStatusChange,
}) => {
  return (
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        checked={checked}
        onChange={(event) => handleCompleteStatusChange(event.target.checked)}
      />
    </label>
  );
});
