/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, useRef } from 'react';

import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  handleTodoDeleting: (id: number) => void;
  toggleStatus: (todo: Todo) => Promise<void>;
  loadingTodoIds: number[];
  isAdding: boolean;
  handleTitleChange: (
    event: React.FormEvent,
    todo: Todo,
    title: string,
  ) => Promise<void>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  handleTodoDeleting,
  toggleStatus,
  loadingTodoIds,
  isAdding,
  handleTitleChange,
}) => {
  const { completed, title, id } = todo;
  const isLoader = loadingTodoIds.includes(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const newTitle = useRef<HTMLInputElement>(null);

  const handleTitleEdit = (event: React.FormEvent) => {
    handleTitleChange(event, todo, editedTitle);

    setIsEditing(false);
  };

  useEffect(() => {
    if (newTitle.current) {
      newTitle.current.focus();
    }
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();

        setIsEditing(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
          onClick={() => toggleStatus(todo)}
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleTitleEdit}
          >
            <input
              ref={newTitle}
              onBlur={handleTitleEdit}
              data-cy="TodoTitleField"
              disabled={isAdding}
              type="text"
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
            />
          </form>
        )
        : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(!isEditing)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              value={id}
              onClick={(event) => {
                handleTodoDeleting(+event.currentTarget.value);
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          {
            'is-active': isLoader,
          },
        )}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
