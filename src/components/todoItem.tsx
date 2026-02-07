import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  onUpdate?: (todo: Todo) => void | Promise<boolean>;
  handleChangeStatus: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  onUpdate,
  handleChangeStatus,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  async function handleChangeItem() {
    const trimmedTitle = newTitle.trim();

    setNewTitle(trimmedTitle);

    if (trimmedTitle.length === 0) {
      onDelete?.(todo.id);

      return;
    }

    if (trimmedTitle !== todo.title && onUpdate) {
      const success = await onUpdate({ ...todo, title: trimmedTitle });

      if (!success) {
        return;
      }
    }

    setIsEditingTitle(false);
  }

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditingTitle(false);
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
          aria-label="Toggle todo status"
          disabled={isLoading}
          onChange={() => handleChangeStatus(todo)}
          readOnly
        />
      </label>
      {isEditingTitle ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleChangeItem();
          }}
        >
          <input
            onKeyUp={handleKeyUp}
            onBlur={handleChangeItem}
            onChange={event => setNewTitle(event.target.value)}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditingTitle(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            disabled={isLoading}
            onClick={() => onDelete?.(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
