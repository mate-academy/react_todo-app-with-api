/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessed?: boolean;
  onDelete?: (todoId: number) => Promise<boolean>;
  onToggle?: (todoId: number, completed: boolean) => Promise<boolean>;
  onRename?: (todoId: number, title: string) => Promise<boolean>;
};

const modalBackgroundClass = [
  'modal-background',
  'has-background-white-ter',
].join(' ');

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed = false,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const isSavingRef = useRef(false);
  const isCancellingRef = useRef(false);

  useEffect(() => {
    if (isEditing && !isProcessed) {
      titleInputRef.current?.focus();
    }
  }, [isEditing, isProcessed]);

  useEffect(() => {
    if (!isEditing) {
      setNewTitle(todo.title);
    }
  }, [todo.title, isEditing]);

  const todoClassName = ['todo', todo.completed ? 'completed' : '']
    .filter(Boolean)
    .join(' ');

  const loaderClassName = ['modal', 'overlay', isProcessed ? 'is-active' : '']
    .filter(Boolean)
    .join(' ');

  const handleEditStart = () => {
    if (isProcessed || todo.id === 0) {
      return;
    }

    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    isCancellingRef.current = true;
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const saveTitle = async () => {
    if (isSavingRef.current || isCancellingRef.current || isProcessed) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setNewTitle(todo.title);
      setIsEditing(false);

      return;
    }

    isSavingRef.current = true;

    let isSuccessful = false;

    if (!trimmedTitle) {
      if (onDelete) {
        isSuccessful = await onDelete(todo.id);
      }
    } else if (onRename) {
      isSuccessful = await onRename(todo.id, trimmedTitle);
    }

    isSavingRef.current = false;

    if (isSuccessful) {
      setNewTitle(trimmedTitle);
      setIsEditing(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveTitle();
  };

  const handleBlur = () => {
    if (isCancellingRef.current) {
      isCancellingRef.current = false;

      return;
    }

    saveTitle();
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleToggle = () => {
    if (!onToggle || isProcessed) {
      return;
    }

    onToggle(todo.id, !todo.completed);
  };

  return (
    <div data-cy="Todo" className={todoClassName}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isProcessed || !onToggle}
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={titleInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            disabled={isProcessed}
            onChange={event => {
              setNewTitle(event.target.value);
            }}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditStart}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isProcessed || !onDelete}
            onClick={() => {
              onDelete?.(todo.id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className={loaderClassName}>
        <div className={modalBackgroundClass} />

        <div className="loader" />
      </div>
    </div>
  );
};
