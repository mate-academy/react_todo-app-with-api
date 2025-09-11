/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  onEditSubmit: (todo: Todo) => void;
  onStartEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
  editingTodoId: number | null;
  editingTitle: string;
  setEditingTitle: (title: string) => void;
  deletingTodoId: number | null;
  deletingTodosIds: number[];
  updatingIds: number[];
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  onToggle,
  onEditSubmit,
  onStartEditing,
  onCancelEditing,
  editingTodoId,
  editingTitle,
  setEditingTitle,
  deletingTodoId,
  deletingTodosIds,
  updatingIds,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      onDoubleClick={() => onStartEditing(todo)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {editingTodoId === todo.id ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            onEditSubmit(todo);
          }}
        >
          <input
            type="text"
            className="todo__title-field"
            data-cy="TodoTitleField"
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onBlur={() => {
              if (!updatingIds.includes(todo.id)) {
                onEditSubmit(todo);
              }
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                onCancelEditing();
              }
            }}
            autoFocus
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {editingTodoId !== todo.id && (
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
            todo.id === 0 ||
            todo.id === deletingTodoId ||
            deletingTodosIds.includes(todo.id) ||
            updatingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
