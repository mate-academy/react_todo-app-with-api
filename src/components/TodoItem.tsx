import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete: () => void;
  onToggle: () => void;
  onRename: (todo: Todo) => boolean;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onToggle,
  onRename,
  isLoading,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsRenaming(false);
  }, [todo]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === todo.title) {
      setIsRenaming(false);

      return;
    }

    if (!trimmedNewTitle) {
      onDelete();

      return;
    }

    if (!onRename({ ...todo, title: trimmedNewTitle })) {
      setIsRenaming(false);
    }
  }

  inputRef.current?.focus();

  return (
    <div data-cy="Todo" className={`todo ${todo.completed && 'completed'}`}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`todoStatus-${todo.id}`}>
        <input
          id={`todoStatus-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
        />
      </label>
      {isRenaming ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setIsRenaming(false);
            }
          }}
        >
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          {/* eslint-enable jsx-a11y/label-has-associated-control */}
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsRenaming(true);
              setNewTitle(todo.title);
              inputRef.current?.focus();
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
        className={`modal overlay ${isLoading && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
