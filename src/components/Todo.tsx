import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  editingTodoId?: number | null;
  isProcessed?: boolean;
  setEditingTodoId: (id: number | null) => void;
  onToggle: (id: number) => void;
  onUpdate: (id: number, title: string) => Promise<void>;
};

export const TodoCard = ({
  todo,
  onDelete,
  isProcessed,
  editingTodoId,
  setEditingTodoId,
  onToggle,
  onUpdate,
}: Props) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  const saveTodo = async () => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      try {
        await onDelete(todo.id);
        setEditingTodoId(null);
      } catch {
        editInputRef.current?.focus();
      }

      return;
    }

    if (trimmedTitle !== todo.title) {
      try {
        await onUpdate(todo.id, trimmedTitle);
        setEditingTodoId(null);
      } catch {
        editInputRef.current?.focus();
      }

      return;
    }

    setEditingTodoId(null);
  };

  const closeEditing = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setNewTitle(todo.title);
      setEditingTodoId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTodo();
  };

  useEffect(() => {
    if (editingTodoId === todo.id) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId, todo.id]);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label
        id={`todo-status-label-${todo.id}`}
        htmlFor={`todo-status-${todo.id}`}
        className="todo__status-label"
      >
        <input
          id={`todo-status-${todo.id}`}
          aria-labelledby={`todo-status-label-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo__status"
        />
      </label>

      {editingTodoId === todo.id ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={editInputRef}
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => closeEditing(e)}
            onBlur={saveTodo}
            data-cy="TodoTitleField"
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(todo.id)}
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
        className={`modal overlay ${isProcessed ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
