/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoEditField } from '../Todoeditfield/Todoeditfield';

type Props = {
  todo: Todo;
  isProcessing?: boolean;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
  onRename?: (id: number, newTitle: string, onSuccess: () => void) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isProcessing = false,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newTitle: string) => {
    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!newTitle) {
      onDelete?.(todo.id);

      return;
    }

    onRename?.(todo.id, newTitle, () => setIsEditing(false));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div data-cy="Todo" className={`todo${todo.completed ? ' completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle?.(todo.id)}
        />
      </label>

      {isEditing ? (
        <TodoEditField
          initialTitle={todo.title}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay${isProcessing ? ' is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
