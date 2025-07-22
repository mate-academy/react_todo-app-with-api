/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface TodoItemProps {
  todo: Todo;
  onDelete?: () => void;
  isTemp?: boolean;
  isLoading?: boolean;
  updateTodo?: (
    updatedTodo: Todo,
    onSuccess?: () => void,
    onError?: () => void,
  ) => void;
}
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  isTemp = false,
  isLoading = false,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
  };

  const handleSave = () => {
    const trimmed = editedTitle.trim();

    if (!trimmed) {
      onDelete?.();

      return;
    }

    if (trimmed && trimmed !== todo.title) {
      updateTodo?.(
        { ...todo, title: trimmed },

        () => setIsEditing(false),
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => updateTodo?.({ ...todo, completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => {
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {todo.title}
          </span>
          {!isTemp && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={onDelete}
              disabled={isLoading}
            >
              ×
            </button>
          )}
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
