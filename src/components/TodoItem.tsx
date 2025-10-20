import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { ErrorMessage } from '../utils/errorMessage';
import { updateTodoTitle } from '../todos';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onToggle: (id: number) => void;
  isDeleting: boolean;
  onDelete: (id: number) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  isDeleting,
  setTodos,
  setErrorMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isUpdating, setisUpdating] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditStart = () => {
    if (!isDeleting && !isLoading) {
      setIsEditing(true);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditedTitle(todo.title);
  };

  const handleEditSave = async () => {
    const newTitle = editedTitle.trim();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    setisUpdating(true);

    if (!newTitle) {
      onDelete(todo.id);

      return;
    }

    try {
      const updated = await updateTodoTitle(todo.id, newTitle);

      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, title: updated.title } : t)),
      );

      setEditedTitle(updated.title);
      setIsEditing(false);
    } catch {
      setErrorMessage(ErrorMessage.UnableToUpdate);
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setisUpdating(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleEditSave();
    } else if (event.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          disabled={isLoading || isDeleting}
        />
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEditStart}
        >
          {todo.title}
        </span>
      ) : (
        <input
          data-cy="TodoTitleField"
          ref={editInputRef}
          className="todo__title-field"
          value={editedTitle}
          onChange={event => setEditedTitle(event?.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleEditSave}
          disabled={isDeleting}
        />
      )}

      {!isEditing && (
        <button
          data-cy="TodoDelete"
          type="button"
          className="todo__remove"
          onClick={() => onDelete(todo.id)}
          disabled={isLoading || isDeleting}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isDeleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
