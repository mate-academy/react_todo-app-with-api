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
  const [isEditing, setIsEditing] = useState(false);
  const [initialEditValue, setInitialEditValue] = useState('');

  const ref = useRef<HTMLInputElement>(null);

  const handleEditValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(event.target.value);
  };

  useEffect(() => {
    ref.current?.focus();
  }, [isEditing]);

  const applyChanges = () => {
    updateTitle(id, editValue);
    setIsEditing(false);
  };

  const handleDoubleClick = () => {
    setInitialEditValue(editValue);
    setIsEditing(true);
  };

  const handleBlur = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editValue.trim()) {
      removeTodo(id);
    }

    applyChanges();
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Escape') {
      return;
    }

    setEditValue(initialEditValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editValue) {
      removeTodo(id);
    }

    if (editValue === title) {
      setEditValue(title);
    }

    applyChanges();
  };

  const handleUpdateStatus = () => {
    updateStatus(id);
  };

  const handleRemoveTodo = () => {
    removeTodo(id);
  };

  const loadingTodoIncludesId = loadingTodo.includes(id);

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
          onClick={handleUpdateStatus}
        />
      </label>

      {isEditing
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
              onChange={handleEditValue}
              onKeyDown={cancelEditing}
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
              onClick={handleRemoveTodo}
            >
              ×
            </button>
          </>
        )}

      <div className={cn('modal overlay',
        { 'is-active': loadingTodoIncludesId })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
