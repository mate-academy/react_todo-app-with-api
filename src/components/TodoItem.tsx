import React, { useRef, useState, useMemo } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  deleteTodo: (value: number) => void;
  isLoading?: boolean;
  handleToggleTodo: (todoId: number, completed: boolean) => Promise<void>;
  handleUpdateTodoTitle: (todoId: number, title: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({
    todo,
    deleteTodo,
    isLoading,
    handleToggleTodo,
    handleUpdateTodoTitle,
  }) => {
    const { id, title, completed } = todo;

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const inputRef = useRef<HTMLInputElement>(null);

    const todoClassName = useMemo(() => {
      return classNames('todo', { completed: completed });
    }, [completed]);

    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleBlur = async () => {
      const newTitleTrimmed = newTitle.trim();

      setNewTitle(newTitleTrimmed);

      if (newTitleTrimmed !== title) {
        try {
          await handleUpdateTodoTitle(id, newTitleTrimmed);
          setIsEditing(false);
        } catch {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      } else {
        setIsEditing(false);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleBlur();
      }

      if (event.key === 'Escape') {
        setNewTitle(title);
        setIsEditing(false);
      }
    };

    return (
      <div
        data-cy="Todo"
        className={todoClassName}
        onDoubleClick={handleDoubleClick}
      >
        <label htmlFor={`todo-${id}`} className="todo__status-label">
          <input
            id={`todo-${id}`}
            aria-label="Toggle todo"
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            disabled={isLoading}
            onChange={() => handleToggleTodo(id, !completed)}
          />
        </label>

        {isEditing ? (
          <input
            ref={inputRef}
            autoFocus
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            data-cy="TodoTitleField"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span data-cy="TodoTitle" className="todo__title">
            {newTitle}
          </span>
        )}

        {!isEditing && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
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
  },
);

TodoItem.displayName = 'TodoItem';
