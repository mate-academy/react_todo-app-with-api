/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  editTitle: string;
  onDelete: (id: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => void;
  onRename: (id: number, newTitle: string) => void;
  setEditingTodoId: (id: number | null) => void;
  setEditTitle: (title: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  isEditing,
  editTitle,
  onDelete,
  onUpdate,
  onRename,
  setEditingTodoId,
  setEditTitle,
}) => {
  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            onRename(todo.id, editTitle);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={() => onRename(todo.id, editTitle)}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setEditingTodoId(null);
              }
            }}
            ref={el => {
              if (el && document.activeElement !== el) {
                el.focus();
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
              setEditingTodoId(todo.id);
              setEditTitle(todo.title);
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
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
