import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FC, FormEvent, KeyboardEvent } from 'react';
import type { Todo } from '../types/Todo';

type TodoChanges = Partial<Pick<Todo, 'title' | 'completed'>>;

type Props = {
  todo: Todo;
  isProcessing: boolean;
  onDelete?: (todoId: number) => Promise<boolean>;
  onUpdate?: (todoId: number, changes: TodoChanges) => Promise<boolean>;
};

export const TodoItem: FC<Props> = ({
  todo,
  isProcessing,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const titleFieldRef = useRef<HTMLInputElement>(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      titleFieldRef.current?.focus();
    }
  }, [isEditing]);

  const startEditing = () => {
    if (!onUpdate || isProcessing) {
      return;
    }

    isSavingRef.current = false;
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    isSavingRef.current = true;
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const saveTitle = async () => {
    if (!isEditing || isSavingRef.current || !onUpdate || !onDelete) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    isSavingRef.current = true;

    if (!trimmedTitle) {
      const wasDeleted = await onDelete(todo.id);

      if (wasDeleted) {
        setIsEditing(false);
      } else {
        isSavingRef.current = false;
      }

      return;
    }

    const wasUpdated = await onUpdate(todo.id, { title: trimmedTitle });

    if (wasUpdated) {
      setIsEditing(false);
    } else {
      isSavingRef.current = false;
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void saveTitle();
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleTitleKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleStatusChange = () => {
    if (!onUpdate || isProcessing) {
      return;
    }

    void onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleTitleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      startEditing();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <div className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label={`Todo status: ${todo.title}`}
          disabled={!onUpdate || isProcessing}
          onChange={handleStatusChange}
        />
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={titleFieldRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            disabled={isProcessing}
            onChange={handleTitleChange}
            onKeyUp={handleTitleKeyUp}
            onBlur={() => void saveTitle()}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            role="button"
            tabIndex={0}
            onDoubleClick={startEditing}
            onKeyDown={handleTitleKeyDown}
          >
            {todo.title}
          </span>

          {onDelete && (
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              aria-label={`Delete ${todo.title}`}
              disabled={isProcessing}
              onClick={() => void onDelete(todo.id)}
            >
              ×
            </button>
          )}
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  isProcessing: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func,
};

