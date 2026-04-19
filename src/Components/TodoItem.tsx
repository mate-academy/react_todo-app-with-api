import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  isDeleteDisabled?: boolean;
  onToggle?: (id: number) => void;
  isEditing?: boolean;
  onStartEdit?: (id: number) => void;
  onCancelEdit?: () => void;
  onSubmitEdit?: (id: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  isDeleteDisabled = false,
  onToggle,
  isEditing = false,
  onStartEdit,
  onCancelEdit,
  onSubmitEdit,
}) => {
  const [draftTitle, setDraftTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const submitingRef = useRef(false);
  const cancelingRef = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    setDraftTitle(todo.title);
    submitingRef.current = false;
    cancelingRef.current = false;
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(todo.title.length, todo.title.length);
  }, [isEditing, todo.title]);

  const editTodo = async () => {
    if (!onSubmitEdit) {
      return;
    }

    if (cancelingRef.current) {
      cancelingRef.current = false;

      return;
    }

    if (submitingRef.current) {
      return;
    }

    submitingRef.current = true;

    try {
      await onSubmitEdit(todo.id, draftTitle);
    } finally {
      submitingRef.current = false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await editTodo();
  };

  const handleOnBlur = async () => {
    await editTodo();
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      cancelingRef.current = true;
      onCancelEdit?.();
    }
  };

  const handleDoubleClick = () => {
    if (!isLoading) {
      onStartEdit?.(todo.id);
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
          onChange={() => onToggle?.(todo.id)}
          aria-label="Toggle todo status"
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={draftTitle}
            onChange={e => setDraftTitle(e.target.value)}
            onBlur={handleOnBlur}
            onKeyUp={handleOnKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete ? () => onDelete(todo.id) : undefined}
            disabled={isDeleteDisabled || !onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
