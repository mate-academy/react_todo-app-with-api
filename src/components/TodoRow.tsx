/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessing: boolean;
  onDelete?: () => Promise<boolean | void>;
  onToggle?: () => Promise<void>;
  onUpdate?: (newTitle: string) => Promise<boolean | void>;
};

export const TodoRow: React.FC<Props> = ({
  todo,
  isProcessing,
  onDelete,
  onToggle,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTodoTitle, setNewTodoTitle] = useState<string>(todo.title);

  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editInput.current?.focus();
    }
  }, [isEditing]);

  async function saveTitle() {
    const normalizedNewTodoTitle = newTodoTitle.trim();

    if (normalizedNewTodoTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const requestSucceeded = normalizedNewTodoTitle
      ? await onUpdate?.(normalizedNewTodoTitle)
      : await onDelete?.();

    if (requestSucceeded) {
      setIsEditing(false);
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveTitle();
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setNewTodoTitle(todo.title);
      setIsEditing(false);
    }
  }

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={event => handleSubmit(event)}>
          <input
            ref={editInput}
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTodoTitle}
            onChange={event => setNewTodoTitle(event.target.value)}
            onBlur={saveTitle}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
