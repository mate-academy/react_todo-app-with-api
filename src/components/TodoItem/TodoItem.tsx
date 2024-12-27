/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useEffect, useState, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types';

type Props = {
  todo: Todo;
  isEditing: boolean;
  isLoading: boolean;
  onDelete?: (id: number) => void;
  onStartEditing?: (id: number) => void;
  onToggleStatus?: (id: number, currentStatus: boolean) => void;
  onUpdateTitle?: (todo: Todo, title: string) => void;
  setEditingTodoId?: (id: number | null) => void;
};

export const TodoItem: FC<Props> = ({
  todo,
  isEditing,
  isLoading,
  onDelete = () => {},
  onStartEditing = () => {},
  onToggleStatus = () => {},
  onUpdateTitle = () => {},
  setEditingTodoId = () => {},
}) => {
  const [currentTitle, setCurrentTitle] = useState('');
  const editTitleInput = useRef<HTMLInputElement>(null);

  const { id, completed, title } = todo;

  const handleUpdateTitle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onUpdateTitle(todo, currentTitle.trim());
  };

  const handleReverseUpdate = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setCurrentTitle(title);
      setEditingTodoId(null);
    }
  };

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing) {
      document.addEventListener('keyup', handleReverseUpdate);

      editTitleInput.current?.focus();
    }

    return () => {
      document.removeEventListener('keyup', handleReverseUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

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
          onChange={() => onToggleStatus(id, completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleUpdateTitle}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={currentTitle}
            onChange={event => setCurrentTitle(event.target.value)}
            onBlur={() => onUpdateTitle(todo, currentTitle.trim())}
            ref={editTitleInput}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onStartEditing(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              onDelete(id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
