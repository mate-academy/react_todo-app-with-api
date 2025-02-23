/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (todoId: number, data: Partial<Todo>) => Promise<void>;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete = () => Promise.resolve(),
  onUpdate = () => Promise.resolve(),
}) => {
  const { id, title, completed } = todo;
  const [editable, setEditable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(isLoading);
  const [editableTodoTitleValue, setEditableTodoTitleValue] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  useEffect(() => {
    setVisible(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (editable && inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [editable, loading]);

  const handleEditTodoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditableTodoTitleValue(event.target.value);
  };

  const handleDeleteTodoButtonClick = () => {
    setLoading(true);

    onDelete(id).finally(() => setLoading(false));
  };

  const handleEditTodoFormSubmit = (
    event: // eslint-disable-next-line @typescript-eslint/indent
    React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    if ('preventDefault' in event) {
      event.preventDefault();
    }

    const trimmedTitle = editableTodoTitleValue.trim();

    setEditableTodoTitleValue(trimmedTitle);

    if (trimmedTitle === title) {
      setEditable(false);

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodoButtonClick();

      return;
    }

    setLoading(true);

    onUpdate(id, { title: trimmedTitle })
      .then(() => {
        setEditable(false);
      })
      .catch(() => {
        setEditable(true);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTodoStatusChange = () => {
    setLoading(true);

    onUpdate(id, { completed: !completed }).finally(() => {
      setLoading(false);
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditable(false);
      setEditableTodoTitleValue(title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
        'item-enter item-enter-active': visible,
        'item-exit item-exit-active': !visible,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoStatusChange}
          disabled={loading}
        />
      </label>

      {editable ? (
        <form onSubmit={handleEditTodoFormSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onChange={handleEditTodoInputChange}
            onBlur={handleEditTodoFormSubmit}
            onKeyDown={handleKeyDown}
            value={editableTodoTitleValue}
            disabled={loading}
            ref={inputRef}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditable(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteTodoButtonClick}
            disabled={loading}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
