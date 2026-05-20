import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading?: boolean;
  onDelete: (todoId: number) => Promise<boolean>;
  onToggle: (todo: Todo) => void;
  onRename: (todoId: number, newTitle: string) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDelete,
  onToggle,
  onRename,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(todo.title);

  React.useEffect(() => {
    setEditedTitle(todo.title);
  }, [todo.title]);

  const handleSubmit = async () => {
    const normalizedTitle = editedTitle.trim();

    if (!normalizedTitle) {
      const isDeleted = await onDelete(todo.id);

      if (isDeleted) {
        setIsEditing(false);
      }

      return;
    }

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    const isUpdated = await onRename(todo.id, normalizedTitle);

    if (isUpdated) {
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={async event => {
            event.preventDefault();

            await handleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={event => setEditedTitle(event.target.value)}
            autoFocus
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setEditedTitle(todo.title);
                setIsEditing(false);
              }
            }}
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <>
          <label
            data-cy="TodoTitle"
            className={'todo__title'}
            onDoubleClick={() => setIsEditing(true)}
          >
            {todo.title}
          </label>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
