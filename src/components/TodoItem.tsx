/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  isLoading: boolean;
  onUpdateTodo: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  onUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setNewTitle(todo.title);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id).catch(() => {
        setIsEditing(true);
        setNewTitle('');
        inputRef.current?.focus();
      });

      return;
    }

    onUpdateTodo({ ...todo, title: trimmedTitle })
      .then(() => setIsEditing(false))
      .catch(() => {
        setIsEditing(true);
        inputRef.current?.focus();
      });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      key={todo.id}
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
          disabled={isLoading}
          onChange={() => onUpdateTodo({ ...todo, completed: !todo.completed })}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEdit}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      ) : (
        <input
          data-cy="TodoTitleField"
          className="todo__title-field"
          type="text"
          ref={inputRef}
          value={newTitle}
          onChange={handleChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
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
};
