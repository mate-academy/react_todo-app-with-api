import React from 'react';
import { Props } from './Props';

export const TodoInfoField: React.FC<Props> = React.memo(({
  setIsEditing,
  onDelete,
  todo,
}) => (
  <>
    <span
      className="todo__title"
      role="button"
      tabIndex={0}
      onClick={(e) => (e.detail === 2
        ? setIsEditing(true)
        : setIsEditing(false))}
      onKeyDown={() => {}}
    >

      {todo.title}

    </span>
    <button
      type="button"
      className="todo__remove"
      onClick={() => onDelete(todo.id)}
    >
      ×
    </button>

  </>
));
