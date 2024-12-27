import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todoInfo: Todo;
  deleteTodo: (v: number) => Promise<void>;
  loadingIds: number[];
  onUpdateStatus?: (v: Todo) => void;
  onUpdateTitle?: (v: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todoInfo,
  deleteTodo,
  loadingIds,
  onUpdateStatus = () => {},
  onUpdateTitle = () => {},
}) => {
  const { id, title, completed } = todoInfo;
  const [readyForEdit, setReadyForEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const editFieldRef = useRef<HTMLInputElement>(null);

  const onEdit = (
    e: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    setReadyForEdit(false);

    if (!editTitle.trim().length) {
      deleteTodo(id).catch(() => setReadyForEdit(true));

      return;
    }

    if (editTitle.trim() === title) {
      setEditTitle(editTitle.trim());

      return;
    }

    const updatedTitleTodo = {
      ...todoInfo,
      title: editTitle.trim(),
    };

    if (onUpdateTitle) {
      const result = onUpdateTitle(updatedTitleTodo);

      if (result instanceof Promise) {
        result.catch(() => setReadyForEdit(true));
      }
    }
  };

  const handleBlurChange = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    onEdit(e);
    setReadyForEdit(false);
  };

  const handleKeyChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setReadyForEdit(false);
    }
  };

  useEffect(() => {
    if (readyForEdit && editFieldRef.current) {
      editFieldRef.current.focus();
    }
  }, [readyForEdit]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label htmlFor={`todoInput-${id}`} className="todo__status-label">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <input
          id={`todoInput-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => onUpdateStatus(todoInfo)}
          onChange={() => {}}
        />
      </label>

      {!readyForEdit && (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setReadyForEdit(!readyForEdit)}
        >
          {title}
        </span>
      )}

      {readyForEdit && (
        <form onSubmit={onEdit}>
          <input
            ref={editFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            placeholder="Empty todo will be deleted"
            onBlur={handleBlurChange}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={handleKeyChange}
          />
        </form>
      )}

      {!readyForEdit && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          key={id}
          onClick={() => deleteTodo(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
