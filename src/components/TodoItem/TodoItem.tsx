/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import './TodoItem.scss';

type Props = {
  todo: Todo;
  loading: boolean;
  onDelete?: () => void;
  onToogleStatus?: () => void;
  updateTodoTitle?: (id: number, title: string) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onDelete = () => {},
  onToogleStatus = () => {},
  updateTodoTitle = () => {},
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const textInput = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState(todo.title);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    textInput.current?.focus();

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTitle(todo.title);
        setIsEditMode(false);
      }
    };

    document.addEventListener('keyup', onKeyUp);

    return () => document.removeEventListener('keyup', onKeyUp);
  }, [isEditMode, todo.title]);

  const handleUpdateTitle = async (event: React.FormEvent) => {
    event.preventDefault();

    if (todo.title === title) {
      setIsEditMode(false);

      return;
    }

    try {
      if (title.trim()) {
        await updateTodoTitle(todo.id, title.trim());
        setTitle(title.trim());
      } else {
        await onDelete();
      }

      setIsEditMode(false);
    } catch (e) {}
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
          onClick={onToogleStatus}
        />
      </label>

      {isEditMode ? (
        <form onBlur={handleUpdateTitle} onSubmit={handleUpdateTitle}>
          <input
            ref={textInput}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditMode(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loading,
        })}
      >
        <div
          className="modal-background
                    has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
