import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (id: number) => void;
  loadingTodo: number[];
  updateStatus: (id: number) => void;
  updateTitle: (id: number, title: string) => void;
}

export const TodoElement: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodo,
  updateStatus,
  updateTitle,
}) => {
  const { id, title, completed } = todo;
  const [editValue, setEditValue] = useState(title);
  const [editForm, setEditForm] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editForm && ref.current) {
      ref.current.focus();
    }
  }, [editForm]);

  const apply = () => {
    updateTitle(id, editValue);
    setEditForm(false);
  };

  const handleDoubleClick = () => {
    setEditForm(true);
  };

  const handleBlur = () => {
    apply();
  };

  const cancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditValue(editValue);
      setEditForm(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editValue) {
      removeTodo(id);
    }

    if (editValue === title) {
      setEditValue(title);
      setEditForm(false);
    }

    apply();
  };

  return (
    <div className={cn('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => updateStatus(id)}
        />
      </label>

      {editForm
        ? (
          <form
            onSubmit={handleSubmit}
            onBlur={handleBlur}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editValue}
              onChange={(event => setEditValue(event.target.value))}
              onKeyDown={cancel}
              ref={ref}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay',
        { 'is-active': loadingTodo.includes(id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
