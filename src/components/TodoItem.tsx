/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isUpdating: boolean;
  isEditing: boolean;
  onEdit: (id: number | null) => void;
  onUpdate: (title: string) => void;
  onToggle: () => void;
  onDelete: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isUpdating,
  isEditing,
  onEdit,
  onUpdate,
  onToggle,
  onDelete,
}) => {
  const [newTitle, setNewTitle] = React.useState(todo.title);
  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    if (isUpdating) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      onEdit(null);

      return;
    }

    if (!trimmedTitle) {
      onDelete();

      return;
    }

    onUpdate(trimmedTitle);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }

    if (e.key === 'Escape') {
      setNewTitle(todo.title);
      onEdit(null);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
          data-cy="TodoStatus"
        />
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => onEdit(todo.id)}
        >
          {todo.title}
        </span>
      ) : (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__edit"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          autoFocus
          disabled={isUpdating}
          onBlur={handleSubmit}
          onKeyUp={handleKeyUp}
        />
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={onDelete}
          disabled={isUpdating}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isUpdating })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
