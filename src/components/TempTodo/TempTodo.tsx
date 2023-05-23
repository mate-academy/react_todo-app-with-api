import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TempTodo: React.FC<Props> = React.memo(({
  todo,
}) => {
  const { title, completed } = todo;

  const [isEdited] = useState(false);

  const editFormRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editFormRef.current && isEdited) {
      editFormRef.current.focus();
    }
  }, [isEdited]);

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
      >
        {'\u00d7'}
      </button>

      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
