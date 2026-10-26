/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, completed: boolean) => void;
  onUpdate: (id: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onDelete,
  onStatusChange,
  onUpdate,
}) => {
  const [isBeingEdited, setIsBeingEdited] = useState(false);
  const [tempTitle, setTempTitle] = useState(todo.title);

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setIsBeingEdited(false);
      setTempTitle(todo.title);
    }
  }

  const handleSave = () => {
    const trimmedNewTitle = tempTitle.trim();

    if (trimmedNewTitle === todo.title) {
      setIsBeingEdited(false);

      return;
    }

    onUpdate(todo.id, trimmedNewTitle).then(() => setIsBeingEdited(false));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSave();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          id={`todo-status-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onStatusChange(todo.id, !todo.completed)}
        />
      </label>

      {isBeingEdited ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={tempTitle}
            onChange={event => setTempTitle(event.target.value)}
            onKeyUp={handleKeyUp}
            autoFocus
            onBlur={handleSave}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsBeingEdited(true)}
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
        className={cn('modal overlay', { 'is-active': isProcessed })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
