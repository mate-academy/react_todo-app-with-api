import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void,
  updateTodos?: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  updateTodos,
}) => {
  const {
    title,
    completed,
    id,
    loading,
  } = todo;

  const [newTitle, setNewTitle] = useState(title);
  const [isEdit, setIsEdit] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEdit) {
      titleField.current?.focus();
    }
  }, [isEdit]);

  const handleCompleted = () => {
    updateTodos?.({
      ...todo,
      completed: !completed,
    });
  };

  const handleEditing = () => {
    setNewTitle(currentTitle => currentTitle.trim());

    if (!newTitle) {
      onDelete?.(id);
    } else if (newTitle !== title) {
      updateTodos?.({
        ...todo,
        title: newTitle,
      }).then(() => {
        setIsEdit(false);
      })
        .catch(() => {
          setIsEdit(true);
        });
    } else {
      setIsEdit(false);
    }
  };

  const handleTitleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleEditing();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEdit(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCompleted}
          disabled={loading}
        />
      </label>

      {!isEdit ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {newTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete?.(id)}
            disabled={loading}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleTitleEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            placeholder="Empty todo will be deleted"
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={handleEditing}
            ref={titleField}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>

  );
});
