import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;

  loading: boolean;

  editingId: number | null;
  editedTitle: string;
  isCancelling: boolean;

  editInputRef: React.RefObject<HTMLInputElement>;

  setEditedTitle: (value: string) => void;
  setEditingId: (id: number | null) => void;
  setIsCancelling: (value: boolean) => void;

  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onRename: (todo: Todo) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  editingId,
  editedTitle,
  isCancelling,
  editInputRef,
  setEditedTitle,
  setEditingId,
  setIsCancelling,
  onToggle,
  onDelete,
  onRename,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          aria-label="Todo status"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          // readOnly
          onChange={() => onToggle(todo)}
          disabled={loading}
        />
      </label>
      {editingId === todo.id ? (
        <form
          onSubmit={async event => {
            event.preventDefault();

            await onRename(todo);
          }}
        >
          <input
            ref={editInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            // autoFocus
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={() => {
              if (isCancelling) {
                setIsCancelling(false);

                return;
              }

              onRename(todo);
            }}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsCancelling(true);
                setEditingId(null);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setEditingId(todo.id);
              setEditedTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
