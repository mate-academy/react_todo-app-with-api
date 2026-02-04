import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
  handleRename: (todo: Todo, newTitle: string) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  updateTodoItem: (id: number, data: Partial<Todo>) => Promise<void | Todo>;
}

const TodoItemComponent: React.FC<Props> = ({
  todo,
  isLoading = false,
  onDelete,
  handleRename,
  editingId,
  setEditingId,
  updateTodoItem,
}) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const editRef = useRef<HTMLInputElement>(null);

  const isEditing = editingId === todo.id;

  useEffect(() => {
    if (isEditing) {
      editRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      onDelete?.(todo.id);

      return;
    }

    handleRename(todo, trimmedTitle);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }

    if (event.key === 'Escape') {
      setEditingId(null);
      setNewTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() =>
            updateTodoItem(todo.id, { completed: !todo.completed })
          }
        />
        <span className="is-sr-only">Toggle status</span>
      </label>

      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          ref={editRef}
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setEditingId(todo.id);
            setNewTitle(todo.title);
          }}
        >
          {todo.title}
        </span>
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete?.(todo.id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isLoading })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export const TodoItem = React.memo(TodoItemComponent);
