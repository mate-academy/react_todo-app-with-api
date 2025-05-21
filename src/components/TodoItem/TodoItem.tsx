/* eslint-disable jsx-a11y/label-has-associated-control */
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  isEditing?: boolean;
  isLoading?: boolean;
  isDeleting?: boolean;
  isToggling?: boolean;
  isRenaming?: boolean;
  onDelete: (id: number) => void;
  handleToggle: (id: number) => void;
  handleRename: (id: number, newTitle: string) => void;
  setEditingId: (id: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  isEditing,
  isLoading,
  isDeleting,
  isToggling,
  isRenaming,
  onDelete,
  handleToggle,
  handleRename,
  setEditingId,
}) => {
  const loading = isLoading || isDeleting || isToggling || isRenaming;

  const [editedTitle, setEditedTitle] = useState(title);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = editedTitle.trim();

    if (!trimmed) {
      onDelete(id);
    } else {
      handleRename(id, trimmed);
    }
  };

  const handleBlur = () => {
    const trimmed = editedTitle.trim();

    if (!trimmed) {
      onDelete(id);
    } else {
      handleRename(id, trimmed);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleToggle(id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            disabled={isLoading}
            onChange={event => setEditedTitle(event.target.value)}
            onBlur={handleBlur}
            autoFocus
            onKeyDown={event => {
              if (event.key === 'Escape') {
                setEditingId(null);
                setEditedTitle(title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingId(id)}
          >
            {title}
          </span>
          <button
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            disabled={isLoading}
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isActive={loading} />
    </div>
  );
};
