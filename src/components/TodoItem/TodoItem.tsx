/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { useState } from 'react';

interface Props {
  id: number;
  title: string;
  completed: boolean;
  loading: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, newTitle: string) => void;
}

const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  loading,
  onToggle,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [isExiting, setIsExiting] = useState(false);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    const trimmed = newTitle.trim();

    if (trimmed === '') {
      onDelete(id);
    } else if (trimmed !== title) {
      onUpdate(id, trimmed);
    }

    setIsExiting(true);

    setTimeout(() => {
      setIsExiting(false);
      setIsEditing(false);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setNewTitle(title);
      setIsExiting(true);

      setTimeout(() => {
        setIsExiting(false);
        setIsEditing(false);
      }, 300);
    }
  };

  return (
    <div data-cy="Todo" className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggle(id)}
        />
      </label>

      {isEditing || isExiting ? (
        <input
          autoFocus
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          placeholder="Empty todo will be deleted"
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleEdit}
        >
          {title}
        </span>
      )}

      {!isEditing && !isExiting && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': loading })}
      >
        <div
          className="modal-background "
          style={{ backgroundColor: 'rgba(10, 10, 10, 0.1)' }}
        />

        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
