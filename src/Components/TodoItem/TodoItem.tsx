/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  onUpdate?: (todo: Todo) => Promise<void>;
  onDelete?: (todoId: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessed,
  onUpdate = () => {
    throw Error();
  },
  onDelete = () => {
    throw Error();
  },
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const updateField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (updateField.current && isFormVisible) {
      updateField.current.focus();
    }
  }, [isFormVisible]);

  const handleDelete = () => {
    onDelete(todo.id);
  };

  const handleUpdateCompleted = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  const handleUpdateTitle = () => {
    if (todo.title === newTitle.trim()) {
      setIsFormVisible(false);

      return;
    }

    if (newTitle.trim().length === 0) {
      handleDelete();

      return;
    }

    onUpdate({ ...todo, title: newTitle.trim() }).then(() =>
      setIsFormVisible(false),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdateTitle();
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsFormVisible(false);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleUpdateCompleted}
        />
      </label>

      {isFormVisible ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={updateField}
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            onBlur={handleUpdateTitle}
            onKeyUp={handleCancel}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsFormVisible(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
