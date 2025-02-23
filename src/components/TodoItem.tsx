/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { UpdateTodo } from '../types/Updates';
import { FilterType } from '../enum/filterTypes';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  updateTodo: ({ id, newData }: UpdateTodo) => Promise<void>;
  todoLoadingStates: { [key: number]: boolean };
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  updateTodo,
  todoLoadingStates,
}) => {
  const { id, completed, title } = todo;
  const { Completed } = FilterType;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>(title);
  const [hasError, setHasError] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const trimmedTitle = newTitle.trim();

  const handleDoubleClick = () => {
    setIsEditing(true);
    setHasError(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleSubmit = async () => {
    if (trimmedTitle === title) {
      console.log('Title did not change');
      setIsEditing(false);

      return;
    } else if (trimmedTitle.length > 0) {
      try {
        await updateTodo({ id, newData: trimmedTitle, keyValue: 'title' });
        setIsEditing(false);
      } catch (error) {
        setHasError(true);
        console.error('Failed to update todo:', error);
      }
    } else {
      onDelete(id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    } else if (event.key === 'Escape') {
      setIsEditing(false);
      setNewTitle(title);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsEditing(false);
        setNewTitle(title);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [title]);

  const handleBlur = () => {
    if (isEditing) {
      handleSubmit();
    }
  };

  return (
    <div
      ref={containerRef}
      data-cy="Todo"
      className={classNames('todo', { completed: !!completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() =>
            updateTodo({ id, newData: !completed, keyValue: Completed })
          }
        />
      </label>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            ref={inputRef}
          />
          {hasError && (
            <div className="error-message" data-cy="TodoError">
              Failed to update. Please try again!
            </div>
          )}
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todoLoadingStates[id] || false,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
