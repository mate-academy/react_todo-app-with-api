import { FC } from 'react';

interface Props {
  id: number,
  onDelete: (id: number) => void,
}

export const TodoDeleteButton: FC<Props> = ({ id, onDelete }) => (
  <button
    type="button"
    className="todo__remove"
    data-cy="TodoDeleteButton"
    onClick={() => onDelete(id)}
  >
    ×
  </button>
);
