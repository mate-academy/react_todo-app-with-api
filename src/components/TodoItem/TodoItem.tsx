import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteTodo: (todoId: Todo['id']) => void;
  isLoading: boolean;
  handleToggleCompleted: (todoId: number) => void;
  handleRenameTodo: (todoId: number, newTitle: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  isLoading,
  handleToggleCompleted,
  handleRenameTodo,
  inputRef,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEditStart = () => {
    setIsEditing(true);
    setEditedTitle(todo.title);
  };

  const handleEditSubmit = async () => {
    const trimmed = editedTitle.trim();

    if (!trimmed) {
      try {
        await handleDeleteTodo(todo.id);
      } catch {
        return;
      }

      setIsEditing(false);

      return;
    }

    if (trimmed !== todo.title) {
      try {
        await handleRenameTodo(todo.id, trimmed);
        setIsEditing(false);
      } catch {
        return;
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditSubmit();
    }

    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            handleToggleCompleted(todo.id);
          }}
        />
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          ref={inputRef}
          type="text"
          className="todo__title-field"
          value={editedTitle}
          placeholder="Empty todo will be deleted"
          onChange={e => setEditedTitle(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditStart}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

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
