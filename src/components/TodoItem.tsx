import cn from 'classnames';
import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { Todo } from '../types/Todo';

type TodoProps = {
  todo: Todo;
  isAddingProceeding?: boolean;
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: boolean) => void,
  onTitleUpdate: (id: number, title: string) => void,
};

export const TodoItem: React.FC<TodoProps> = ({
  todo,
  isAddingProceeding,
  onDelete,
  onStatusUpdate,
  onTitleUpdate,
}) => {
  const { title, completed, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [loading, setIsLoading] = useState(false);

  const handleTodoDeleting = async () => {
    setIsLoading(true);

    await onDelete(id);

    setIsLoading(false);
  };

  const handleTodoStatusUpdate = async () => {
    setIsLoading(true);

    await onStatusUpdate(id, !completed);

    setIsLoading(false);
  };

  const handleEditorOpen = () => {
    setIsEditing(true);
  };

  const handleTodoEditing = (e: ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleTodoTitleUpdate = async () => {
    setIsLoading(true);

    if (title !== editedTitle && editedTitle) {
      await onTitleUpdate(id, editedTitle);
    }

    if (!editedTitle) {
      await onDelete(id);
    }

    setIsLoading(false);
    setIsEditing(false);
  };

  const handleCancelEditing = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          onChange={handleTodoStatusUpdate}
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleTodoTitleUpdate();
        }}
        >
          <input
            onBlur={handleTodoTitleUpdate}
            onKeyUp={handleCancelEditing}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={handleTodoEditing}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleEditorOpen}
          >
            {editedTitle}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={handleTodoDeleting}
          >
            ×
          </button>
        </>
      )}
      <div
        className={cn(
          'modal',
          'overlay',
          {
            'is-active': isAddingProceeding || loading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
