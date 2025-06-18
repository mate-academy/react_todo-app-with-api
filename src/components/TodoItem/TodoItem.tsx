import { memo, FC, useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (
    id: number,
    onSuccess?: () => void,
    onFailure?: () => void,
  ) => void;
  isLoading: boolean;
  isTemporary?: boolean;
  onUpdateTitle: (
    id: number,
    title: string,
    onSuccess?: () => void,
    onFailure?: () => void,
  ) => void;
};

export const TodoItem: FC<TodoItemProps> = memo(
  ({ todo, onToggle, onDelete, isLoading, isTemporary, onUpdateTitle }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(todo.title);
    const editInputRef = useRef<HTMLInputElement>(null);

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
      const trimmedTitle = editedTitle.trim();

      if (isSaving || isLoading || isTemporary) {
        return;
      }

      if (trimmedTitle === '') {
        setIsSaving(true);
        onDelete(
          todo.id,
          () => {
            setIsEditing(false);
            setIsSaving(false);
          },
          () => {
            setIsSaving(false);
          },
        );

        return;
      }

      if (trimmedTitle === todo.title) {
        setIsEditing(false);

        return;
      }

      setIsSaving(true);
      onUpdateTitle(
        todo.id,
        trimmedTitle,
        () => {
          setIsEditing(false);
          setIsSaving(false);
        },
        () => {
          setIsSaving(false);
        },
      );
    };

    const handleCancel = () => {
      setEditedTitle(todo.title);
      setIsEditing(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSave();
      } else if (event.key === 'Escape') {
        handleCancel();
      }
    };

    useEffect(() => {
      if (isEditing) {
        editInputRef.current?.focus();
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
            disabled={isLoading || isSaving || isTemporary}
            onChange={() => onToggle(todo.id)}
            aria-label="Toggle todo status"
          />
        </label>

        {isEditing ? (
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            ref={editInputRef}
            disabled={isLoading || isSaving || isTemporary}
            aria-label="Edit todo title"
            placeholder="Empty todo will be deleted"
          />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {
                if (!isLoading && !isSaving) {
                  setIsEditing(true);
                  setEditedTitle(todo.title);
                }
              }}
            >
              {todo.title}
            </span>

            {!isLoading && !isSaving && !isTemporary && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => onDelete(todo.id)}
                disabled={isLoading || isSaving || isTemporary}
              >
                ×
              </button>
            )}
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': isLoading || isTemporary || isSaving,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
