/* eslint-disable max-len */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface TodoProps {
  todo: Todo,
  onDeleteTodo(id: number): void,
  isUpdating: number[],
  onToggleStatus(id: number, completed: boolean): Promise<void>,
  isToggleAll: boolean
  onTitleChange(id: number, title: string): Promise<void>,
}

export const TodoItem: React.FC<TodoProps> = ({
  todo,
  onDeleteTodo,
  isUpdating,
  onToggleStatus,
  isToggleAll,
  onTitleChange,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [updateTodo, setUpdateTodo] = useState(title);

  const inputRef = useRef<HTMLInputElement>(null);

  const checkTitle = (newTitle: string) => {
    if (newTitle === '') {
      onDeleteTodo(id);
      setIsEditing(false);
    }

    if (title !== newTitle) {
      onTitleChange(id, newTitle);
      setIsEditing(false);
    }

    setIsEditing(false);
  };

  const handleToggleStatus = () => {
    onToggleStatus(id, !completed);
  };

  const onBlur = () => {
    checkTitle(updateTodo);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    checkTitle(updateTodo);
  };

  const onEscKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdateTodo(title);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          aria-label="Enter to do"
          type="checkbox"
          className="todo__status"
          onClick={handleToggleStatus}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={onSubmit}>
            <input
              type="text"
              className="todoapp__new-todo todoapp__edit-todo"
              placeholder={title}
              value={updateTodo}
              ref={inputRef}
              onBlur={onBlur}
              onKeyUp={onEscKeyUp}
              onChange={(event) => setUpdateTodo(event.target.value)}
            />
          </form>
        )
        : (
          <span className="todo__title" onDoubleClick={() => setIsEditing(true)}>
            {updateTodo}
          </span>
        )}

      {isUpdating.includes(id)
        ? (
          <div className={classNames('modal overlay', {
            'is-active': isUpdating || isToggleAll,
          })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )
        : (
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        )}
    </div>
  );
};
