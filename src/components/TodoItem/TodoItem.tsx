import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  editingId: number | null;
  editingTitle: string;
  processedIds: number[];
  tempTodo: Todo | null;
  isAdding: boolean;
  onToggle: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onStartEditing: (todo: Todo) => void;
  onRename: (todo: Todo) => void;
  setEditingTitle: (title: string) => void;
  setEditingId: (id: number | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editingId,
  editingTitle,
  processedIds,
  tempTodo,
  isAdding,
  onToggle,
  onDelete,
  onStartEditing,
  onRename,
  setEditingTitle,
  setEditingId,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', { completed: todo.completed })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />
      <span className="visually-hidden">Toggle todo status</span>
    </label>

    {editingId === todo.id ? (
      <form
        onSubmit={e => {
          e.preventDefault();
          onRename(todo);
        }}
      >
        <input
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={editingTitle}
          onChange={e => setEditingTitle(e.target.value)}
          onBlur={() => onRename(todo)}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setEditingId(null);
            }
          }}
          autoFocus
        />
      </form>
    ) : (
      <span
        data-cy="TodoTitle"
        className="todo__title"
        onDoubleClick={() => onStartEditing(todo)}
      >
        {todo.title}
      </span>
    )}

    {editingId !== todo.id && (
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    )}

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active':
          (isAdding && tempTodo?.id === todo.id) ||
          processedIds.includes(todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
