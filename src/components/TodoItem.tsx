/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: {
    title: string;
    userId: number;
    id: number;
    completed: boolean;
  };
  isLoading?: boolean;
  onDelete: (id: number) => void;
  onUpdate: (updatedTodo: Todo) => void;
  toggleTodoCompletion: (todoId: number) => void;
  loader: boolean;
  loaderId: number | null;
};
export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
  toggleTodoCompletion,
  loader,
  loaderId,
}) => {
  const { title, id, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    onUpdate({ ...todo, title: editText });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setTimeout(() => {
        setIsLoaderActive(false);
      }, 300);
      setIsEditing(false);
      setEditText(editText);
      onUpdate({ ...todo, title: editText });
      setIsLoaderActive(true);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      {completed}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          placeholder="Empty todo will be deleted"
          onChange={() => toggleTodoCompletion(id)}
          checked={completed}
        />
      </label>

      {isEditing ? (
        <>
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              placeholder="Empty todo will be deleted"
              className="todo__title-field"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              ref={editInputRef}
            />
          </form>
          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isLoading || loaderId === id || loader,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {editText}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          onDelete(id);
        }}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loaderId === id || isLoading || isLoaderActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
