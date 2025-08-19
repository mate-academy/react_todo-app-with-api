/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/todo';

type Props = {
  todo: Todo;
  isSaving: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdateTitle: (id: number, newTitle: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isSaving,
  onToggle,
  onRemove,
  onUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  const startEdit = () => {
    setLocalTitle(todo.title);
    setIsEditing(true);
    // фокус чуть позже, когда инпут отрендерится
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const attemptSave = async () => {
    if (submittingRef.current) {
      return;
    }

    submittingRef.current = true;

    const ok = await onUpdateTitle(todo.id, localTitle);

    if (ok) {
      setIsEditing(false);
    } else {
      // оставляем форму открытой и возвращаем фокус
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }

    submittingRef.current = false;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await attemptSave();
  };

  const handleKeyDown: React.KeyboardEventHandler<
    HTMLInputElement
  > = async e => {
    if (e.key === 'Escape') {
      // откат изменений и выход
      setLocalTitle(todo.title);
      setIsEditing(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      await attemptSave();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={startEdit}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isSaving}
          onChange={onToggle}
        />
      </label>

      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isSaving}
            onClick={onRemove}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleEditSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={localTitle}
            onChange={e => setLocalTitle(e.target.value)}
            onBlur={attemptSave}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isSaving })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
