/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  selectedTodoId?: number;
  onDelete: (todoId: number) => void;
  onUpdate: (todoId: number, newTitle: string) => Promise<void>;
  onSelect?: (todo: Todo) => void;
  deletingTodoId: number[];
  updatingTodoId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onSelect = () => {},
  onDelete = () => {},
  deletingTodoId,
  updatingTodoId,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = async () => {
    const trimmed = title.trim();

    if (!trimmed) {
      try {
        await onDelete(todo.id);
        setIsEditing(false);
      } catch {
        setIsEditing(true);
      }

      return;
    }

    if (trimmed === todo.title) {
      setIsEditing(false);

      return;
    }

    // 🔹 иначе — обновляем
    try {
      await onUpdate(todo.id, trimmed);
      setIsEditing(false);
    } catch {
      // Ошибка обновления → остаёмся в режиме редактирования
    }
  };

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={`todo ${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onSelect?.(todo)}
        />
      </label>

      {!isEditing ? (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      ) : (
        <input
          type="text"
          className="todo__title-field"
          data-cy="TodoTitleField"
          value={title}
          autoFocus
          onChange={e => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleBlur();
            } else if (e.key === 'Escape') {
              setTitle(todo.title);
              setIsEditing(false);
            }
          }}
        />
      )}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => onDelete(todo.id)}
          data-cy="TodoDelete"
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${
          todo.id === 0 ||
          deletingTodoId?.includes(todo.id) ||
          updatingTodoId?.includes(todo.id)
            ? 'is-active'
            : ''
        }`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
