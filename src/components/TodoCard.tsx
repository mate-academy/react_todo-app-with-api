/* eslint-disable jsx-a11y/label-has-associated-control */

import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

import classNames from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoCard: React.FC<Props> = ({ todo, onDelete, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const isLoading = todo.id === 0 || isDeleting || isUpdating;

  const editInputRef = useRef<HTMLInputElement>(null);

  // focus when double editing

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleDelete = async () => {
    if (todo.id === 0) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(todo.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async () => {
    setIsUpdating(true);

    try {
      await onUpdate(todo.id, { completed: !todo.completed });
      setIsUpdating(false);
    } catch (error) {
      setIsUpdating(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(todo.title);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleTitleSubmit = async () => {
    const title = newTitle.trim();

    if (title === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!title) {
      handleDelete();

      return;
    }

    setIsUpdating(true);

    try {
      await onUpdate(todo.id, { title });
      setIsUpdating(false);
      setIsEditing(false);
    } catch (error) {
      setIsUpdating(false);
      setIsEditing(true);
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleTitleSubmit();
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={handleStatusChange}
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={event => {
              event.preventDefault();
              handleTitleSubmit();
            }}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editInputRef}
              value={newTitle}
              onChange={handleTitleChange}
              onBlur={handleBlur}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {todo.title}
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

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', { 'is-active': isLoading })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
