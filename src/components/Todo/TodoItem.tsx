/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodoApi } from './Context';
import React, { useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isProcessed: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isProcessed }) => {
  const { id, title, completed } = todo;
  const { handleCompletedChange, handleTitleChange, handleTodoRemove } =
    useTodoApi();
  const [editValue, setEditValue] = useState<string | null>(null);
  const inputReference = useRef<HTMLInputElement>(null);

  const handleInputCompletedChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => handleCompletedChange(id, event.currentTarget.checked);

  const handleEditSave = async () => {
    if (!isProcessed && editValue !== null) {
      const trimmedTitle = editValue.trim();
      let succeeded = true;

      if (!trimmedTitle.length) {
        succeeded = await handleTodoRemove(id);
      } else if (title !== trimmedTitle) {
        succeeded = await handleTitleChange(id, trimmedTitle);
      }

      if (succeeded) {
        setEditValue(null);
      } else {
        inputReference.current?.focus();
      }
    }
  };

  const handleEditStart = () => setEditValue(title);

  const handleEdit = (event: React.ChangeEvent<HTMLInputElement>) =>
    setEditValue(event.currentTarget.value);

  const handleSubmit = (event: React.FormEvent) => {
    handleEditSave();
    event.preventDefault();
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditValue(null);
    }
  };

  const handleRemove = () => handleTodoRemove(id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          name="TodoStatus"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleInputCompletedChange}
        />
      </label>

      {editValue !== null ? (
        <form onSubmit={handleSubmit}>
          <input
            name="TodoTitleField"
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editValue}
            onChange={handleEdit}
            onBlur={handleEditSave}
            onKeyUp={handleCancel}
            ref={inputReference}
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleEditStart}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleRemove}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
