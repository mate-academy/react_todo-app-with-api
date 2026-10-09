/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  isTemporary?: boolean;
  isEditing: boolean;
  editingTitle: string;
  onDelete: (todoId: number) => void;
  onToggle: (todo: Todo) => void;
  onStartEditing: (todo: Todo) => void;
  onEditingTitleChange: (title: string) => void;
  onSaveEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  isTemporary = false,
  isEditing,
  editingTitle,
  onDelete,
  onToggle,
  onStartEditing,
  onEditingTitleChange,
  onSaveEditing,
  onCancelEditing,
}) => (
  <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
    <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
      <input
        id={`todo-${todo.id}`}
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        aria-label={`Toggle ${todo.title}`}
        readOnly={isTemporary}
        onChange={() => {
          if (!isTemporary) {
            onToggle(todo);
          }
        }}
      />
    </label>

    {isEditing ? (
      <form
        onSubmit={event => {
          event.preventDefault();
          onSaveEditing(todo);
        }}
      >
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          aria-label="Edit todo title"
          value={editingTitle}
          onChange={event => onEditingTitleChange(event.target.value)}
          onBlur={() => onSaveEditing(todo)}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              onCancelEditing();
            }
          }}
          autoFocus
        />
      </form>
    ) : (
      <>
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            if (!isTemporary) {
              onStartEditing(todo);
            }
          }}
        >
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          aria-label={`Delete ${todo.title}`}
          onClick={() => {
            if (!isTemporary) {
              onDelete(todo.id);
            }
          }}
        >
          ×
        </button>
      </>
    )}

    <div
      data-cy="TodoLoader"
      className={`modal overlay ${isLoading ? 'is-active' : ''}`}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
