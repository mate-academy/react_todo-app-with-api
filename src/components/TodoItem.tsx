import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  checkboxTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  update: number[];
  updateTodo: (todo: Todo) => Promise<void | Todo>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  checkboxTodo,
  deleteTodo,
  update,
  updateTodo,
}) => {
  const { completed, title, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, [isEditing]);

  const doubleClick = () => {
    setIsEditing(true);
    setEditTitle(title);
  };

  const editCancel = () => {
    setIsEditing(false);
    setEditTitle('');
  };

  const handleEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === title) {
      editCancel();

      return;
    }

    if (trimmedTitle) {
      updateTodo({
        ...todo,
        title: trimmedTitle,
      })
        .then(() => {
          editCancel();
        })
        .catch(() => {});
    } else {
      deleteTodo(id);
    }
  };

  const handleKeyUp = (key: React.KeyboardEvent<HTMLInputElement>) => {
    if (key.code === 'Escape') {
      editCancel();
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
          onChange={() => checkboxTodo(todo)}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={doubleClick}
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
            ref={input}
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
          'is-active': update.includes(id) || id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
