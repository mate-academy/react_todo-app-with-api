/* eslint-disable jsx-a11y/no-autofocus */
import cn from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  isProcessing: boolean;
  deleteTodoById: (id: number) => void,
  changeStatus: (id: number, completed: boolean) => void
  updateTitle: (id:number, title: string) => void
}

export const TodoInfo:React.FC<Props> = React.memo(
  ({
    todo,
    isProcessing,
    deleteTodoById,
    changeStatus,
    updateTitle,
  }) => {
    const {
      title,
      completed,
      id,
    } = todo;

    const [newTitle, setNewTitle] = useState(title);
    const [showEditForm, setShowEditForm] = useState<boolean>(false);

    const handleDeleteButtonClick = () => {
      deleteTodoById(id);
    };

    const handleStatusChange = async () => {
      await changeStatus(id, completed);
    };

    const handleLoseInputFocus = async () => {
      if (!newTitle.trim()) {
        deleteTodoById(id);

        return;
      }

      if (newTitle !== title) {
        await updateTitle(id, newTitle);
      }

      setShowEditForm(false);
    };

    const handleSubmit = async (
      event:React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();
      await updateTitle(id, newTitle);
      setShowEditForm(false);
    };

    const handleEscape = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowEditForm(false);
        setNewTitle(title);
      }
    };

    const handleNewTitleChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setNewTitle(event.target.value);
    };

    return (
      <div
        className={cn('todo', {
          completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={completed}
            onClick={handleStatusChange}
          />
        </label>

        {showEditForm
          ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="todo__title-field"
                placeholder="Empty todo will be deleted"
                value={newTitle}
                onChange={handleNewTitleChange}
                onBlur={handleLoseInputFocus}
                onKeyUp={handleEscape}
                autoFocus
              />
            </form>
          )
          : (
            <>
              <span
                className="todo__title"
                onDoubleClick={() => setShowEditForm(true)}
              >
                {title}
              </span>

              <button
                type="button"
                className="todo__remove"
                onClick={handleDeleteButtonClick}
              >
                ×
              </button>
            </>
          )}

        <div className={cn('modal overlay', {
          'is-active': isProcessing,
        })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
