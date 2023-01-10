import { FC } from 'react';

interface Props {
  id: number,
  onToggle: (id: number) => void,
}

export const TodoStatusLabel: FC<Props> = ({
  id,
  onToggle,
}) => (
  <label className="todo__status-label">
    <input
      data-cy="TodoStatus"
      type="checkbox"
      className="todo__status"
      onClick={() => onToggle(id)}
      defaultChecked
    />
  </label>
);
