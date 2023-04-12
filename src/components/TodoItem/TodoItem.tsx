import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onStatusChanged: () => void;
  updateTodo: (id: number, newTitle: string) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  isLoading,
  onDelete,
  onStatusChanged,
  updateTodo,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleTitleUpdate = useCallback(() => {
    if (!newTitle.trim()) {
      onDelete(id);
    } else if (newTitle !== title) {
      updateTodo(id, newTitle);
    }

    setEditMode(false);
  }, [newTitle]);

  const onFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleTitleUpdate();
  };

  const inputTitle = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setNewTitle(title);
    setEditMode(false);
  };

  useEffect(() => {
    if (inputTitle.current !== null) {
      inputTitle.current.focus();
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [editMode]);

  return (
    <div
      key={id}
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={onStatusChanged}
          checked={completed}
        />
      </label>

      {!editMode && (
        <span
          className="todo__title"
          onDoubleClick={() => setEditMode(true)}
        >
          {title}
        </span>
      )}

      {editMode && (
        <form onSubmit={onFormSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            ref={inputTitle}
            onBlur={handleTitleUpdate}
          />
        </form>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
