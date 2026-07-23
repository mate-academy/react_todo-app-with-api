import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loadingTodoIds: number[];
  onDelete: (todoId: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoIds,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);
  const isLoading = loadingTodoIds.includes(todo.id);

  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(todo.title);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewTitle(todo.title);
  };

  const handleSaveTitle = async () => {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      try {
        await onDelete(todo.id);
      } catch {
        // Помилка видалення обробляється глобально
      }

      return;
    }

    try {
      await onUpdate({ ...todo, title: trimmedTitle });
      setIsEditing(false);
    } catch {
      // Залишаємось у режимі редагування при помилці
    }
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    handleSaveTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <span className="is-sr-only">Toggle todo status</span>
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmitForm}>
          <input
            data-cy="TodoTitleField"
            ref={editInputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyUp={handleKeyUp}
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
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* Overlay з лоадером */}
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
