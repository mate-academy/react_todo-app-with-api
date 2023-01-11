import cn from 'classnames';
import {
  FormEventHandler, KeyboardEventHandler, useEffect, useState,
} from 'react';
import { StateTodo } from '../../context/useAppContext';

interface Props {
  todo: StateTodo;
  onRemove?: VoidFunction;
  onStatusChange?: VoidFunction;
  onEditing?: (value: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo: {
    title,
    completed,
    isLoading,
  },
  onRemove,
  onStatusChange,
  onEditing,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formInput, setFormInput] = useState<HTMLInputElement | null>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (formInput) {
      formInput.focus();
    }
  }, [formInput]);

  const handleTitleChange = () => {
    if (!formInput || !onEditing) {
      return;
    }

    formInput.blur();
    onEditing(formInput.value);
  };

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    handleTitleChange();
  };

  const handleEscDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Escape' && formInput) {
      formInput.blur();
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={onStatusChange}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleFormSubmit}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            ref={(ref) => setFormInput(ref)}
            onBlur={() => {
              setIsEditing(false);
              handleTitleChange();
            }}
            onKeyDown={handleEscDown}
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {title}
        </span>
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={onRemove}
      >
        ×
      </button>

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
