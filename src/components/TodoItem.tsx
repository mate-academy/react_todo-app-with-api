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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, [isEditing]);

  const handleDeleteTodo = () => {
    setIsDeleting(true);
    onDeleteTodo(id);
  };

  const handleSubmit = () => {
    const trimedTitle = newTitle.trim();
    switch (trimedTitle) {
      case '':
        handleDeleteTodo();
        return;

      case title:
        setIsEditing(false);
        return;

      default:
        setIsEditing(false);
        setIsUpdating(true);
        onUpdateTodo({ ...todo, title: trimedTitle })
          .finally(() => {
            setIsUpdating(false);
          });
    }
  };

  const handleKeyUp = (event: TyKeybrEvtInputElmt) => {
    switch (event.key) {
      case 'Escape':
        setIsEditing(false);
        setNewTitle(title);
        return;

      case 'Enter':
        handleSubmit();
        return;

      default:
    }
  };

  const handleTodoChecked = (
    event: TyChangeEvtInputElmt,
  ) => {
    setIsUpdating(true);
    onUpdateTodo({ ...todo, completed: event.target.checked, })
      .finally(() => setIsUpdating(false));
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
          'is-active': isProcessed || isDeleting || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
