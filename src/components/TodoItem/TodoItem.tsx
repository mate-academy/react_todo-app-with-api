/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Types';

type Props = {
  todo: Todo;
  onRename?: (updatedTitle: string) => Promise<void>;
  onToggle?: () => Promise<void>;
  onRemove?: () => Promise<void>;
  isProcessing?: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, onRename, onToggle, onRemove, isProcessing }) => {
    const [isEdited, setIsEdited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [todoTitle, setTodoTitle] = useState(todo.title);

    const startTitleChange = () => {
      setIsEdited(true);
      setTodoTitle(todo.title);
    };

    const endTitleInput = useCallback(() => {
      setIsEdited(false);
      setTodoTitle(todo.title);
    }, [todo.title]);

    const handleEscapePress = useCallback(
      (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          endTitleInput();
        }
      },
      [endTitleInput],
    );

    const handleTodoRemove = async () => {
      setIsLoading(true);
      if (onRemove) {
        try {
          await onRemove();
        } finally {
          setIsLoading(false);
        }
      }
    };

    const handleTodoToggle = async () => {
      setIsLoading(true);
      if (onToggle) {
        try {
          await onToggle();
        } finally {
          setIsLoading(false);
        }
      }
    };

    const handleTodoRenameSubmit = async (
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const titleToSubmit = todoTitle.trim();

      if (titleToSubmit === todo.title) {
        endTitleInput();

        return;
      }

      setIsLoading(true);

      if (onRename) {
        try {
          await onRename(titleToSubmit);
          endTitleInput();
        } finally {
          setIsLoading(false);
        }
      }
    };

    const handleTitleInputChange = (
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setTodoTitle(event.target.value);
    };

    useEffect(() => {
      document.addEventListener('keyup', handleEscapePress);

      return () => document.removeEventListener('keyup', handleEscapePress);
    }, [handleEscapePress]);

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
            onChange={handleTodoToggle}
          />
        </label>

        {isEdited ? (
          <form
            onSubmit={handleTodoRenameSubmit}
            onBlur={handleTodoRenameSubmit}
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={todoTitle}
              onChange={handleTitleInputChange}
              autoFocus
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={startTitleChange}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoRemove}
            >
              ×
            </button>
          </>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isLoading || isProcessing,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);

TodoItem.displayName = 'TodoItem';
