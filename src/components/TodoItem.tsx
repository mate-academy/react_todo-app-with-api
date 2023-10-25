import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  toggleTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  isUpdating: number[];
  updateTodo: (todo: Todo) => Promise<void | Todo>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  deleteTodo,
  isUpdating,
  updateTodo,
}) => {
  const { completed, title, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditTitle('');
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === title) {
      handleEditCancel();

      return;
    }

    if (trimmedTitle) {
      updateTodo({
        ...todo,
        title: trimmedTitle,
      })
        .then(() => {
          handleEditCancel();
        })
        .catch(() => {});
    } else {
      deleteTodo(id);
    }
  };

  const handleKeyUp = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => toggleTodo(todo)}
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
            onClick={() => deleteTodo(id)}
          >
            ×
          </button>
        </>
      ) : (
        <form
          onSubmit={handleEdit}
          onBlur={handleEdit}
        >
          <input
            data-cy="TodoTitleField"
            ref={inputField}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => setEditTitle(event.target.value)}
            onKeyUp={handleKeyUp}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isUpdating.includes(id) || id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
