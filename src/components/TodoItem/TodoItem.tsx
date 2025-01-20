/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface TodoItemProps {
  todo: Todo;
  deleteTodo: (id: number) => void;
  updateStatusTodo: (todo: Todo) => void;
  todoIds: number[];
  onChangeTitle: (todo: Todo, newTitle: string) => Promise<boolean>;
  errorMessage: string;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  deleteTodo,
  updateStatusTodo,
  todoIds,
  onChangeTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [isSaving, setIsSaving] = useState(false);

  const isTodoLoading = todoIds.includes(todo.id);

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (isSaving) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    setIsSaving(true);

    try {
      if (!trimmedTitle) {
        const isSuccess = await onChangeTitle(todo, '');

        if (!isSuccess) {
          return;
        }

        return;
      }

      if (trimmedTitle !== todo.title) {
        const isSuccess = await onChangeTitle(todo, trimmedTitle);

        if (isSuccess) {
          setEditedTitle(trimmedTitle);
          setIsEditing(false);
        }
      } else {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleCheckboxClick = () => {
    if (!isEditing || editedTitle.trim() === todo.title) {
      updateStatusTodo(todo);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', todo.completed && 'completed')}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxClick}
        />
      </label>
      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className={cn('todo__title', {
            'todo__title--placeholder': !todo.title,
          })}
          onDoubleClick={() => setIsEditing(true)}
        >
          {editedTitle || <em>Empty todo will be deleted</em>}
        </span>
      ) : (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSave();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>
      )}

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {isTodoLoading && (
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': todoIds.map(id => id === todo.id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
