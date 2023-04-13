import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

import { updateTodo, deleteTodo } from '../../api/todos';

interface Props {
  todo?: Partial<Todo> | null;
  isProcessed: boolean;
  onDelete?: () => void;
  onUpdate: (newTitle: string) => void | Promise<void | Partial<Todo>>;
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

    const filteredText = innerText.replace(/(\r||\r)/g, '');

    setNewTitle(filteredText);

    if (keyCode === 13) {
      if (filteredText !== '') {
        onUpdate(filteredText);
        setEditing(false);
      } else if (todo?.id !== null && todo?.id !== undefined) {
        setEditing(false);
        deleteTodo(todo.id);
      }
    }
  };

  const handleDoublebClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setEditing(true);
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
      {!editing
        ? (
          <>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <span
              className="todo__title"
              // onKeyDown={handleUpdateTitle}
              contentEditable={editing}
              onDoubleClick={handleDoublebClick}
            >
              {newTitle}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )
        : (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              onKeyDown={handleUpdateTitle}
              value={newTitle}
            />
          </form>
        ) }
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
