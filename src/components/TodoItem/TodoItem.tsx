import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  handleDelete: (todoId: number) => Promise<void>;
  onCheck: (todoId: number) => void;
  onUpdate: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  handleDelete,
  onCheck,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const saveTitle = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === '') {
      handleDelete(todo.id).catch(() => {});

      return;
    }

    if (trimmedTitle === todo.title.trim()) {
      setIsEditing(false);

      return;
    }

    onUpdate(todo.id, trimmedTitle)
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: todo.completed },
        { 'is-processing': isProcessed },
      )}
    >
      <label className="todo__status-label" aria-label="Todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onCheck(todo.id)}
        />
      </label>

      {!isEditing && (
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
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {isEditing && (
        <form
          onSubmit={event => {
            event.preventDefault();

            saveTitle();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => {
              setEditedTitle(event.target.value);
            }}
            onBlur={saveTitle}
            onKeyUp={handleKeyUp}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
