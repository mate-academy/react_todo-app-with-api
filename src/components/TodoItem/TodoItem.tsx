/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  processingTodos?: number[];
  onDelete?: (todoId: number) => Promise<void>;
  onEdit?: (todoId: number, updatedFields: Partial<Todo>) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete = () => Promise.resolve(),
  onEdit = () => Promise.resolve(),
  processingTodos,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const isLoading = todo.id === 0 || processingTodos?.includes(todo.id);

  const editInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      onDelete(todo.id)
        .then(() => setIsEditing(false))
        .catch(() => {
          editInputRef.current?.focus();
          setIsEditing(true);
        });

      return;
    }

    onEdit(todo.id, { title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {
        editInputRef.current?.focus();
        setIsEditing(true);
      });
  };

  const handleEditFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEdit();
  };

  const handleEditControls = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Escape') {
      return;
    }

    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onEdit(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleEditFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            ref={editInputRef}
            onBlur={handleEdit}
            onKeyUp={handleEditControls}
          />
        </form>
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
