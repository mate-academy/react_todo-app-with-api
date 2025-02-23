/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { useState } from 'react';
import { Todo as TodoType } from '../types/Todo';
import { TodoForm } from './TodoForm';
import { ErrorNotification } from './ErrorNotification';

type Props = {
  id: number;
  title: string;
  completed: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: Partial<TodoType>) => void;
  idsProcessing: number[];
  isTemp?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Todo: React.FC<Props> = ({
  id,
  title,
  completed,
  onDelete,
  onEdit,
  idsProcessing,
  isTemp = false,
  inputRef,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompleted = async () => {
    try {
      await onEdit(id, { completed: !completed });
    } catch (e) {
      if (e instanceof Error && e.message) {
        setError(e.message);
      } else {
        setError('An error occurred');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(id);
    } catch (e) {
      if (e instanceof Error && e.message) {
        setError(e.message);
      } else {
        setError('An error occurred');
      }
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleFormattedTitle = async (valueTitle: string) => {
    const formattedTitle = valueTitle.trim();

    if (!formattedTitle) {
      return handleDelete();
    }

    if (valueTitle === title) {
      setIsEditing(false);

      return;
    }

    try {
      await onEdit(id, { title: formattedTitle });

      setIsEditing(false);
    } catch (e) {
      inputRef.current?.focus();
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={handleCompleted}
          checked={completed}
        />
      </label>

      {isEditing ? (
        <div onKeyUp={({ key }) => key === 'Escape' && setIsEditing(false)}>
          <TodoForm
            title={title}
            onSubmit={handleFormattedTitle}
            inputRef={inputRef}
          />
        </div>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setIsEditing(true)}
        >
          {title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDelete}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': idsProcessing.includes(id) || isTemp,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      {error && (
        <ErrorNotification errorMessage={error} onClose={handleCloseError} />
      )}
    </div>
  );
};
