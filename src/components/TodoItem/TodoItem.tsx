import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

import { updateTodo } from '../../api/todos';

interface Props {
  todo?: Partial<Todo> | null;
  isProcessed: boolean;
  onDelete?: () => void;
  onUpdate: (title: any) => Promise<void | Partial<Todo>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onUpdate,
}) => {
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo?.title);

  const handleToggleChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    idToUpdate: number | undefined,
  ) => {
    const { target } = event;
    const { checked } = target;

    if (idToUpdate) {
      updateTodo(idToUpdate, { completed: checked });
    }
  };

  const handleUpdateTitle = (
    event: React.KeyboardEvent<HTMLSpanElement>,
  ) => {
    const { keyCode } = event;

    const { target } = event;
    const { innerText } = target as HTMLSpanElement;

    setNewTitle(innerText);

    if (keyCode === 13) {
      onUpdate(innerText);

      setEditing(false);
    }
  };

  return (
    <div className={
      classNames(
        'todo',
        { completed: todo?.completed },
      )
    }
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={(event) => handleToggleChecked(event, todo?.id)}
        />
      </label>

      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <span
        className="todo__title"
        onKeyDown={handleUpdateTitle}
        contentEditable={editing}
        onDoubleClick={() => setEditing(true)}
        // onChange={handleEditTitle}
      >
        {newTitle}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={onDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      {isProcessed && (
        <div className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
