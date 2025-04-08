import { FormEvent, useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: () => Promise<void>;
  onUpdate?: () => Promise<void>;
  onEditTitle?: (title: string) => Promise<void>;
  isTemp?: boolean;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  onEditTitle,
  isTemp = false,
  isLoading = false,
}) => {
  const [loading, setLoading] = useState(false);
  const isTodoLoading = loading || isLoading;
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const saveInProgress = useRef<boolean>(false);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [editing]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTitle(todo.title);
        setEditing(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [todo.title]);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  const handleEditTitle = () => {
    setEditing(true);
    setTitle(todo.title);
  };

  const handleDeleteTodo = async () => {
    if (!onDelete) {
      return;
    }

    setLoading(true);
    try {
      await onDelete();
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async () => {
    if (!onUpdate) {
      return;
    }

    try {
      await onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const saveEditedTitle = async () => {
    if (!onEditTitle || saveInProgress.current) {
      return;
    }

    saveInProgress.current = true;

    try {
      const trimmedTitle = title.trim();

      if (trimmedTitle && trimmedTitle !== todo.title) {
        await onEditTitle(trimmedTitle);
      } else if (trimmedTitle === '') {
        await handleDeleteTodo();
      }

      saveInProgress.current = false;
      setEditing(false);
    } catch (error) {}
  };

  const onSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    saveEditedTitle();
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      onDoubleClick={handleEditTitle}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      {editing ? (
        <form onSubmit={onSubmitForm}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={saveEditedTitle}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          {!isTemp && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDeleteTodo}
              disabled={isTodoLoading}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
