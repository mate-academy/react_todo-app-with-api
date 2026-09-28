import React, {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessing: boolean;
  // Updated to pass only necessary primitives (Checklist Item 10)
  onDelete: (id: number) => Promise<void>;
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onRename: (id: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessing,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setDraftTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  const startEditing = (): void => {
    setDraftTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEditing = (): void => {
    setDraftTitle(todo.title);
    setIsEditing(false);
  };

  const commitRename = async (): Promise<void> => {
    const trimmed = draftTitle.trim();

    // Same title → just cancel.
    if (trimmed === todo.title) {
      cancelEditing();

      return;
    }

    if (trimmed === '') {
      try {
        await onDelete(todo.id);
        setIsEditing(false);
      } catch (error) {
        throw error;
      }

      return;
    }

    // Rename the todo
    try {
      await onRename(todo.id, trimmed);
      setIsEditing(false);
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    try {
      await commitRename();
    } catch (error) {
      // Error is already handled in App.tsx (notification shown).
      // We keep isEditing true so the user can retry.
    }
  };

  const handleBlur = async (): Promise<void> => {
    try {
      await commitRename();
    } catch (error) {
      // Error handled by parent
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
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
          onChange={() => onToggle(todo.id, !todo.completed)}
          aria-label={`Mark "${todo.title}" as completed`}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={editFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={draftTitle}
            onChange={event => setDraftTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
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
        className={classNames('modal', 'overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
