import React, { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TyChangeEvtInputElmt, TyKeybrEvtInputElmt } from '../types/General';

type Props = {
  todo: Todo;
  onDeleteTodo?: (todoId: Todo['id']) => Promise<void>;
  onUpdateTodo?: (updatedTodo: Todo) => Promise<void>;
  isProcessed?: boolean;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDeleteTodo = () => new Promise(() => { }),
  onUpdateTodo = () => new Promise(() => { }),
  isProcessed = false,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing]);

  const handleDeleteTodo = () => {
    onDeleteTodo(id)
      .then(() => setIsEditing(false))
      .catch(() => titleField.current?.focus());
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isProcessed) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    switch (trimmedTitle) {
      case '':
        handleDeleteTodo();

        break;

      case title:
        setIsEditing(false);

        break;

      default:
        if (titleField.current) {
          titleField.current.disabled = true;
        }

        onUpdateTodo({ ...todo, title: trimmedTitle })
          .then(() => {
            setIsEditing(false);
            if (titleField.current) {
              titleField.current.disabled = false;
            }
          })
          .catch(() => titleField.current?.focus());

        break;
    }
  };

  const handleKeyUp = (event: TyKeybrEvtInputElmt) => {
    // eslint-disable-next-line
    console.info(event.key);

    switch (event.key) {
      case 'Escape':
        setIsEditing(false);
        setNewTitle(title);

        break;

      default:

        break;
    }
  };

  const handleTodoChecked = (
    event: TyChangeEvtInputElmt,
  ) => {
    onUpdateTodo({ ...todo, completed: event.target.checked });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleTodoChecked}
        />
      </label>

      {!isEditing
        ? (
          <div>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              aria-label="deleteTodo"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </div>
        )
        : (
          <form
            onSubmit={handleSubmit}
          >
            {/* This form is shown instead of the title and remove button */}
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={titleField}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onBlur={handleSubmit}
              onKeyUp={handleKeyUp}
            />
          </form>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isProcessed,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
