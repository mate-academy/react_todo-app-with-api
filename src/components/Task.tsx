/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState, useRef, useEffect } from 'react';
import type { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: () => void;
  onToggle: (todoId: number) => Promise<void>;
  toggleIds: number[];
  onRename?: (todoId: number, newTitle: string) => Promise<void>;
};

export default function Task({
  todo,
  isLoading = false,
  onDelete,
  onToggle,
  toggleIds,
  onRename,
}: Props) {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(todo.title);

  const focusRef = useRef<HTMLInputElement>(null);
  const isSavingRef = useRef(false);
  const isCancellingRef = useRef(false);

  useEffect(() => {
    if (showForm) {
      focusRef.current?.focus();
    }
  }, [showForm]);

  const onDoubleHandler = () => {
    setTitle(todo.title);
    isSavingRef.current = false;
    isCancellingRef.current = false;
    setShowForm(true);
  };

  const saveTitle = async () => {
    if (isSavingRef.current || isCancellingRef.current) {
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      isSavingRef.current = true;
      onDelete?.();
      setShowForm(false);

      return;
    }

    if (trimmedTitle === todo.title) {
      setShowForm(false);

      return;
    }

    if (!onRename) {
      setShowForm(false);

      return;
    }

    isSavingRef.current = true;

    try {
      await onRename(todo.id, trimmedTitle);
      setShowForm(false);
    } catch {
      focusRef.current?.focus();
    } finally {
      isSavingRef.current = false;
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void saveTitle();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && !isSavingRef.current) {
      e.preventDefault();

      isCancellingRef.current = true;
      setTitle(todo.title);
      setShowForm(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onToggle(todo.id)}
          readOnly
        />
      </label>

      {showForm ? (
        <form onSubmit={submitHandler}>
          <input
            ref={focusRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            onChange={event => setTitle(event.currentTarget.value)}
            onBlur={() => void saveTitle()}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={onDoubleHandler}
          >
            {todo.title}
          </span>

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

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || toggleIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
