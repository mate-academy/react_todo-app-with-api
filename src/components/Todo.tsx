/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    data: Partial<Pick<TodoType, 'title' | 'completed'>>,
  ) => Promise<boolean>;
};

export const Todo: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const escapePressed = useRef(false);

  useEffect(() => {
    setTitle(todo.title);
  }, [todo.title]);

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
      editFieldRef.current?.select();
    }
  }, [isEditing]);

  const handleToggle = () => {
    void onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!isEditing || isLoading) {
      return;
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      setTitle(todo.title);

      return;
    }

    if (!trimmedTitle) {
      onDelete(todo.id);

      return;
    }

    const success = await onUpdate(todo.id, {
      title: trimmedTitle,
    });

    if (success) {
      setIsEditing(false);
    } else {
      setTitle(trimmedTitle);
    }
  };

  const handleBlur = () => {
    if (escapePressed.current) {
      escapePressed.current = false;

      return;
    }

    void handleSubmit();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      escapePressed.current = true;
      setTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isLoading || isEditing}
        />
      </label>

      {!isEditing && (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              if (!isLoading) {
                setIsEditing(true);
              }
            }}
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
      )}

      {isEditing && (
        <form onSubmit={handleSubmit}>
          <input
            ref={editFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            disabled={isLoading}
          />
        </form>
      )}
    </div>
  );
};

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
