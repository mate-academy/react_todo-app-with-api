/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onUpdate: (id: number, todoData: Partial<Todo>) => void;
  onDelete: (todoId: number) => void;
  processedTodosIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onUpdate,
  onDelete,
  processedTodosIds,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const editField = useRef<HTMLInputElement>(null);

  const isTodoProcessing = processedTodosIds.includes(id) || id === 0;

  const handleDelete = () => onDelete(id);

  const handleSubmit = async (
    event: // eslint-disable-next-line @typescript-eslint/indent
    React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const validEditedTitle = editedTitle.trim();

    if (validEditedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!validEditedTitle) {
      handleDelete();

      return;
    }

    setEditedTitle(validEditedTitle);

    try {
      await onUpdate(id, { title: validEditedTitle });
      setIsEditing(false);
    } catch (error) {
      setIsEditing(true);

      throw error;
    }
  };

  const handleEsc = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  useEffect(() => {
    if (editField.current && isEditing) {
      editField.current.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            onUpdate(id, { completed: !completed });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={editField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleSubmit}
            onKeyUp={handleEsc}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isTodoProcessing })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
