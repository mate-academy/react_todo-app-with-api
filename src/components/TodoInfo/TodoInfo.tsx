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

  const handleTitleChange = (updatedTodo: Todo) => {
    if (updatedTitle.length === 0) {
      onDelete([updatedTodo.id]);
    } else if (updatedTitle !== todoInfo.title) {
      onUpdate([
        {
          ...updatedTodo,
          title: updatedTitle,
        },
      ]);
    }

    setIsEdited(false);
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
          onSubmit={() => handleTitleChange(todoInfo)}
          onBlur={() => handleTitleChange(todoInfo)}
          onKeyDown={event => {
            if (event.key === 'Escape') {
              setUpdatedTitle(todoInfo.title);
              setIsEdited(false);
            }
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            placeholder="Empty todo will be deleted"
            className="todo__title-field"
            value={updatedTitle}
            ref={updatedField}
            autoFocus
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
