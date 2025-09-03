/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { Processing } from '../types/Processing';
import { USER_ID } from '../api/todos';

type Props = {
  todo: Todo;

  deleteTodoHandle: (todoId: number) => void;
  singleToggleHandle: (id: number, title: string, completed: boolean) => void;
  renameTodoHandle: (value: Todo) => Promise<boolean>;

  isProcessing: Processing;
};

export const TodoItem: React.FC<Props> = ({
  todo: { title, completed, id },
  deleteTodoHandle,
  singleToggleHandle,
  renameTodoHandle,
  isProcessing,
}) => {
  const [showEditingForm, setShowEditingForm] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const handleSubmit = () => {
    setUpdatedTitle(prev => prev.trim());

    if (updatedTitle === title) {
      setShowEditingForm(false);

      return;
    }

    if (!updatedTitle.length) {
      deleteTodoHandle(id);

      return;
    }

    renameTodoHandle({
      id,
      title: updatedTitle,
      completed,
      userId: USER_ID,
    }).then(response => setShowEditingForm(response));
  };

  const reset = () => {
    setUpdatedTitle(title);
    setShowEditingForm(false);
  };

  const keyUpHandle = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      reset();
    }

    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed })}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status loader"
            checked={completed}
            onChange={() => singleToggleHandle(id, title, completed)}
          />
        </label>

        {showEditingForm ? (
          <input
            data-cy="TodoTitleField"
            type="text"
            value={updatedTitle}
            placeholder={
              updatedTitle.length === 0
                ? 'Empty todo will be deleted'
                : updatedTitle
            }
            onChange={e => setUpdatedTitle(e.target.value)}
            className="todo__title-field"
            onBlur={handleSubmit}
            onKeyUp={keyUpHandle}
            autoFocus
          />
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setShowEditingForm(true)}
            >
              {updatedTitle}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => deleteTodoHandle(id)}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active':
              id === 0 ||
              id === isProcessing.deleting ||
              isProcessing.submitting.includes(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
