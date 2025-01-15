/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { USER_ID } from '../../api/todos';

type Props = {
  todo: Todo;
  onDelete?: (todoId: number) => Promise<void>;
  loadingIds: number[];
  onUpdateCheckbox?: (updatedPost: Todo) => Promise<void>;
  onUpdateTitle?: (updatedTodo: Todo, cur: string) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  onDelete = () => {},
  loadingIds = [],
  onUpdateCheckbox = () => {},
  onUpdateTitle = () => {},
}) => {
  const [currentTitle, setCurrentTitle] = useState(title);
  const [editingTodo, setEditingTodo] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formInputRef.current) {
      formInputRef.current.focus();
    }
  }, [editingTodo]);

  const handleUpdateTitle = async () => {
    if (isSubmitted) {
      return;
    }

    setIsSubmitted(true);
    const trimmedTitle = currentTitle.trim();

    if (!trimmedTitle) {
      await onDelete(id);
    } else if (currentTitle === title) {
      setCurrentTitle(trimmedTitle);
      setEditingTodo(false);
    } else {
      await onUpdateTitle(
        { id, title, userId: USER_ID, completed },
        trimmedTitle,
      );
      setCurrentTitle(trimmedTitle);
      setEditingTodo(false);
    }

    setIsSubmitted(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdateTitle();
  };

  const handleBlur = () => {
    handleUpdateTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setCurrentTitle(title);
      setEditingTodo(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() =>
            onUpdateCheckbox({ id, title, userId: USER_ID, completed })
          }
        />
      </label>
      {editingTodo ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={formInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            autoFocus
            value={currentTitle}
            onBlur={handleBlur}
            onChange={event => setCurrentTitle(event.target.value)}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodo(true)}
          >
            {currentTitle}
          </span>

          {id ? (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
            >
              x
            </button>
          ) : (
            ''
          )}
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingIds.includes(id),
        })}
      >
        {/* eslint-disable-next-line */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
