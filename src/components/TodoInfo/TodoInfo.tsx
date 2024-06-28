/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  todoInfo: Todo;
  todosForProcesing?: Todo[];
  onDelete: (todo: Todo[]) => void;
  onUpdate: (updatedTodo: Todo) => Promise<void>;
}

export const TodoInfo: React.FC<Props> = ({
  todoInfo,
  todosForProcesing,
  onDelete = () => {},
  onUpdate,
}) => {
  const [updatedTitle, setUpdatedTitle] = useState(todoInfo.title);
  const [isEdited, setIsEdited] = useState(false);
  const updatedField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    updatedField.current?.focus();
  }, [isEdited]);

  const processingIds = todosForProcesing?.map(todo => todo.id);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = updatedTitle.trim();

    if (trimmedTitle === todoInfo.title) {
      setIsEdited(false);

      return;
    }

    if (!trimmedTitle) {
      onDelete([todoInfo]);

      return;
    }

    setUpdatedTitle(trimmedTitle);

    onUpdate({ ...todoInfo, title: updatedTitle }).then(() => {
      setIsEdited(false);
    });
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
            onUpdate({
              ...todoInfo,
              completed: !todoInfo.completed,
            });
          }}
        />
      </label>

      {isEdited ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyDown={event => {
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
            placeholder="Empty todo will be deleted"
            className="todo__title-field"
            value={updatedTitle}
            onChange={event => setUpdatedTitle(event.target.value)}
            ref={updatedField}
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
            {updatedTitle}
          </span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete([todoInfo]);
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
          'is-active': processingIds?.includes(todoInfo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
