/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import * as f from '../api/todos';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  isLoading: boolean;
  setErrorText: (text: string) => void;
  handleUpdateTodo: (id: number, newTitle: string, completed: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  setErrorText,
  handleUpdateTodo,
}) => {
  const { title, completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDelete = () => {
    setDeleteLoading(true);
    f.deleteTodo(id)
      .then(() => {
        setDeleteLoading(false);
        onDelete(id);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
        setDeleteLoading(false);
        setErrorText('Unable to delete a todo');
      });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();

    setIsEditing(false);

    if (!trimmedTitle) {
      handleDelete();

      return;
    }

    setIsSaving(true);

    try {
      await handleUpdateTodo(id, trimmedTitle, completed);
      setIsEditing(false);
    } catch (error) {
      setErrorText('Unable to update a todo');
      setIsEditing(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const trimmedTitle = editTitle.trim();

      if (!trimmedTitle) {
        handleDelete();
      } else {
        handleSave();
      }
    } else if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: !isLoading && completed,
        editing: isEditing,
      })}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-checkbox-${id}`}
        onClick={() => handleUpdateTodo(id, title, !completed)}
      >
        <input
          id={`todo-checkbox-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            ref={inputRef}
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={e => {
              if (!isSaving && e.relatedTarget !== inputRef.current) {
                handleSave();
              }
            }}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
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

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading || deleteLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
