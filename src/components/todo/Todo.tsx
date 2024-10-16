/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo as TypeTodo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: TypeTodo;
  handleDelete: (todoId: number) => void;
  loadingTodos: number[];
  handleToggleTodo: (id: number, currentStatus: boolean) => void;
  handleTitleUpdate: (id: number, newTitle: string) => void;
};

export const Todo: React.FC<Props> = ({
  todo,
  handleDelete,
  loadingTodos,
  handleToggleTodo,
  handleTitleUpdate,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && input.current) {
      input.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setNewTitle(title);
  };

  const handleEditSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault();
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      handleDelete(id);
    } else {
      handleTitleUpdate(id, newTitle);
    }
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleEditBlur = () => {
    if (newTitle.trim() !== title) {
      handleTitleUpdate(id, newTitle);
    }

    if (newTitle.trim() === '') {
      handleDelete(id);
    }

    setIsEditing(false);
  };

  const handleEditKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleToggleTodo(id, completed)}
        />
      </label>

      {!isEditing ? (
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
            onClick={() => handleDelete(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleEditSubmit}>
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            ref={input}
            value={newTitle}
            onChange={handleEditChange}
            onBlur={handleEditBlur}
            onKeyUp={handleEditKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loadingTodos.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
