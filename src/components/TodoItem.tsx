import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  handleDeleteTodo: (todoId: number) => void;
  handleToggleTodo: (todo: Todo) => void;
  handleUpdateTitle: (todoId: number, title: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed, isLoading, userId },
  handleDeleteTodo,
  handleToggleTodo,
  handleUpdateTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const todoId = `todo-${id}`;

  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(title);
    }
  }, [title, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditedTitle(title);
  };

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      handleDeleteTodo(id);

      return;
    }

    try {
      await handleUpdateTitle(id, trimmedTitle);
      setIsEditing(false);
    } catch (error) {}
  };

  const handleEscapeKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(title);
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  return (
    <div
      className={classNames('todo', {
        completed: completed,
      })}
      data-cy="Todo"
    >
      <label className="todo__status-label" htmlFor={todoId}>
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={todoId}
          checked={completed}
          onChange={() =>
            handleToggleTodo({
              id,
              title,
              completed,
              isLoading,
              userId,
            })
          }
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} data-cy="TodoForm">
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleEscapeKey}
            ref={inputRef}
            disabled={isLoading}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
