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
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(todo.title);
    const inputRef = useRef<HTMLInputElement>(null);

    const todoClassName = useMemo(() => {
      return classNames('todo', { completed: todo.completed });
    }, [todo.completed]);

    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleBlur = async () => {
      const newTitleTrimmed = newTitle.trim();

      setNewTitle(newTitleTrimmed);

      if (newTitleTrimmed !== todo.title) {
        try {
          await handleUpdateTodoTitle(todo.id, newTitleTrimmed);
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
        setNewTitle(todo.title);
        setIsEditing(false);
      }
    };

    return (
      <div
        data-cy="Todo"
        className={todoClassName}
        onDoubleClick={handleDoubleClick}
      >
        <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
          <input
            id={`todo-${todo.id}`}
            aria-label="Toggle todo"
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            disabled={isLoading}
            onChange={() => handleToggleTodo(todo.id, !todo.completed)}
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
            onClick={() => deleteTodo(todo.id)}
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
