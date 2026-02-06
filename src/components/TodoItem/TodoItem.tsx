import React, { useEffect } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onToogle: (todoId: number) => Promise<void>;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, newTitle: string) => Promise<void>;
  isChanging: Set<number>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onToogle,
  onDelete,
  onUpdate,
  isChanging,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const submittedRef = React.useRef<boolean>(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(todo.title);

  useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    } else {
      submittedRef.current = false;
    }
  }, [isEditing]);

  const startEditing = () => {
    setIsEditing(true);
  };

  const finishEditing = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      startEditing();
    }
  };

  const submitEdit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (submittedRef.current) {
      return;
    }

    submittedRef.current = true;

    const trimmed = editedTitle.trim();

    if (!trimmed) {
      try {
        await onDelete(todo.id);
        setIsEditing(false);
      } catch (error) {
        submittedRef.current = false;
        inputRef.current?.focus();

        return;
      }
    }

    if (trimmed === todo.title) {
      submittedRef.current = false;
      finishEditing();

      return;
    }

    try {
      await onUpdate(todo.id, trimmed);
      setIsEditing(false);
      submittedRef.current = true;
    } catch (error) {
      submittedRef.current = false;
      inputRef.current?.focus();
    }
  };

  const handleBlur = () => {
    if (!submittedRef.current) {
      submitEdit();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      finishEditing();
    }

    if (e.key === 'Enter') {
      submitEdit();
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToogle(todo.id)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={startEditing}
            onKeyDown={handleKeyDown}
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
      ) : (
        <form onSubmit={submitEdit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isChanging.has(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
