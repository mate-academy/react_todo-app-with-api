import cn from 'classnames';

import { Todo } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  isProcessing?: boolean;
  onDelete?: () => void;
  onToggle?: () => void;
  onUpdateTitle?: (newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessing,
  onDelete,
  onToggle,
  onUpdateTitle,
}) => {
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(todo.title);

  function handleDeleteClick() {
    onDelete?.();
  }

  function handleChangeStatus() {
    onToggle?.();
  }

  function handleEditTodo() {
    setIsEdited(true);
  }

  function handleTitleChange(newTitleValue: string) {
    setNewTitle(newTitleValue);
  }

  async function handleBlurInput(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const normalizedTitle = newTitle.trim();

    try {
      await onUpdateTitle?.(normalizedTitle);
      setIsEdited(false);
    } catch {}
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEdited(false);
    }
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label aria-label="Mark todo as completed" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleChangeStatus}
        />
      </label>

      {isEdited ? (
        <form onSubmit={event => handleBlurInput(event)}>
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => handleTitleChange(event.target.value)}
            onBlur={() => handleBlurInput()}
            onKeyUp={handleKeyUp}
            disabled={isProcessing}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditTodo}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isProcessing })}
      >
        <div
          className="
              modal-background
              has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
