/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  todoInfo: Todo;
  todosForProcesing?: number[];
  onDelete: (id: number[]) => void;
  onUpdate: (updatedTodo: Todo[]) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todoInfo,
  todosForProcesing,
  onDelete = () => {},
  onUpdate = () => {},
}) => {
  const [updatedTitle, setUpdatedTitle] = useState(todoInfo.title);
  const [isEdited, setIsEdited] = useState(false);
  const updatedField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (updatedField.current) {
      updatedField.current.focus();
    }
  }, [isEdited]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedNewTitle = updatedTitle.trim();

    if (trimmedNewTitle === todoInfo.title) {
      setIsEdited(false);

      return;
    }

    if (!trimmedNewTitle) {
      onDelete([todoInfo.id]);

      return;
    }

    onUpdate([{ ...todoInfo, title: trimmedNewTitle }]);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todoInfo.completed,
      })}
      key={todoInfo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todoInfo.completed}
          onClick={() => {
            onUpdate([
              {
                ...todoInfo,
                completed: !todoInfo.completed,
              },
            ]);
          }}
        />
      </label>

      {isEdited ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setUpdatedTitle(todoInfo.title);
              setIsEdited(false);
            }
          }}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={updatedTitle}
            onChange={event => setUpdatedTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setUpdatedTitle(todoInfo.title);
              setIsEdited(true);
            }}
          >
            {updatedTitle || todoInfo.title}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete([todoInfo.id]);
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todosForProcesing?.includes(todoInfo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
