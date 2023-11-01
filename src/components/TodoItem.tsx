import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Error';

type Props = {
  todo: Todo;
  checkboxTodo: (todo: Todo) => void;
  deleteTodo: (id: number) => void;
  update: number[];
  updateTodo: (todo: Todo) => Promise<void | Todo>;
  mesage: (message: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  checkboxTodo,
  deleteTodo,
  update,
  updateTodo,
  mesage,
}) => {
  const { completed, title, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && input.current) {
      input.current.focus();
    }
  }, [isEditing]);

  const doubleClick = () => {
    setIsEditing(true);
  };

  const editCancel = () => {
    setIsEditing(false);
  };

  const edit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle) {
      try {
        await updateTodo({
          ...todo,
          title: trimmedTitle,
        });
        editCancel();
      } catch (error) {
        mesage(Errors.title);
      }
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
          onSubmit={edit}
          onBlur={edit}
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
