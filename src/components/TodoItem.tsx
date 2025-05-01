import { useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

type Props = {
  onDelete: (todoId: number) => Promise<boolean>;
  onUpdate: (todo: Todo) => Promise<boolean>;
  todo: Todo;
  isTempTodoDeleting?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isTempTodoDeleting,
  onUpdate,
}) => {
  const { title, completed, id } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const editTitleRef = useRef<HTMLInputElement>(null);

  const handleEditTitle = async () => {
    setIsEditing(true);

    const trimmedTitle = editTitle.trim();

    if (title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      const tryDelete = await onDelete(id);

      if (!tryDelete) {
        editTitleRef.current?.focus();
      }

      return;
    }

    const success = await onUpdate({
      ...todo,
      title: trimmedTitle,
    });

    if (success) {
      setIsEditing(false);
    } else {
      editTitleRef.current?.focus();
    }
  };

  const handleToggleCompleted = () => {
    const todoForUpdate = {
      ...todo,
      completed: !todo.completed,
    };

    onUpdate(todoForUpdate);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditTitle();
    }

    if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed === true })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleCompleted}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onBlur={handleEditTitle}
          onKeyUp={handleKeyUp}
          ref={editTitleRef}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
            disabled={isTempTodoDeleting}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTempTodoDeleting || todo.isDeleting || todo.isEditing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
