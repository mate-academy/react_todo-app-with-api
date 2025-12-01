/* eslint-disable jsx-a11y/label-has-associated-control */

import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  editingTodoId: number | null;
  editingTitle: string;
  loadingTodoIds: number[];
  onStartEdit: (id: number, title: string) => void;
  onUpdateTitle: (todo: Todo, newTitle: string) => void;
  onDelete: (id: number) => void;
  onToggle: (todo: Todo) => void;
  editFieldRef: React.RefObject<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  onCancelEdit: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  editingTodoId,
  editingTitle,
  loadingTodoIds,
  onStartEdit,
  onUpdateTitle,
  onDelete,
  onToggle,
  editFieldRef,
  onCancelEdit,
}) => {
  const isEditing = editingTodoId === todo.id;
  const isLoading = loadingTodoIds.includes(todo.id);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label" htmlFor={`checkbox-${todo.id}`}>
        <input
          id={`checkbox-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          disabled={isLoading}
        />
      </label>

      {isEditing ? (
        <input
          ref={editFieldRef}
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          value={editingTitle}
          autoFocus
          onChange={e => onStartEdit(todo.id, e.target.value)}
          onBlur={e => onUpdateTitle(todo, e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onUpdateTitle(todo, e.currentTarget.value);
            }

            if (e.key === 'Escape') {
              onCancelEdit();
            }
          }}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => !isLoading && onStartEdit(todo.id, todo.title)}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
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
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
