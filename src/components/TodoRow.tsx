import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  onTodoDelete?: () => Promise<void>,
  onTodoUpdate?: (todo: Todo) => Promise<void>,
};

export const TodoRow: React.FC<Props> = ({
  todo,
  isLoading,
  onTodoDelete,
  onTodoUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editingInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && editingInput.current) {
      editingInput.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    onTodoUpdate?.({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.length) {
      onTodoDelete?.();
    }

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    onTodoUpdate?.({
      ...todo,
      title: newTitle,
    });

    setIsEditing(false);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
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
            onClick={onTodoDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            ref={editingInput}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                setNewTitle(todo.title);
                setIsEditing(false);
              }
            }}
          />
        </form>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
