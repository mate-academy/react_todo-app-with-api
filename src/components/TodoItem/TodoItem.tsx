/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';

import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (value: number, onSuccess?: () => void) => void;
  updateTodo?: (updatedTodo: Todo, onSucces?: () => void) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  updateTodo,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleEdit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (editingId === null) {
      return;
    }

    if (!editTitle.trim()) {
      onDelete?.(todo.id, () => setEditingId(null));

      return;
    }

    if (editTitle.trim() === todo.title) {
      setEditingId(null);

      return;
    }

    updateTodo?.({ ...todo, title: editTitle.trim() }, () => {
      setEditingId(null);
    });
  };

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId === todo.id) {
      editInputRef.current?.focus();
    }
  }, [editingId, todo.id]);

  const doubleClick = () => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
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
          onChange={() => {
            updateTodo?.({ ...todo, completed: !todo.completed });
          }}
        />
      </label>

      {editingId === todo.id ? (
        <form onSubmit={handleEdit}>
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={event => {
              setEditTitle(event.target.value);
            }}
            onBlur={() => handleEdit()}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditTitle(todo.title);
                setEditingId(null);
              }
            }}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={doubleClick}
        >
          {todo.title}
        </span>
      )}

      {editingId !== todo.id && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
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
