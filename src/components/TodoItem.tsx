/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  todo: Todo;
  isLoadingTodo: number | null;
  failedTodoId: number | null;
  onChange: (todoId: number | undefined, todoCompleted: boolean) => void;
  onDelete: (todoId: number | undefined) => void;
  updateTodo: (todoId: number, updates: Partial<Todo>) => void;
}

const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  isLoadingTodo,
  failedTodoId,
  onChange,
  onDelete,
  updateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState<string>(title);
  const itemInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (failedTodoId === id) {
      setIsEditing(true);
      itemInputRef.current?.focus();
    }
  }, [failedTodoId, id]);

  function handleDoubleClick() {
    setIsEditing(true);
    setTimeout(() => itemInputRef.current?.focus(), 0);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditTitle(event.target.value);
  }

  function handleBlur() {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (trimmedTitle === '') {
      onDelete(id);

      return;
    }

    if (id) {
      updateTodo(id, { title: editTitle.trim() });
    }

    setIsEditing(false);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleBlur();
    }

    if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
      onDoubleClick={handleDoubleClick}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          disabled={isLoadingTodo !== null && isLoadingTodo === id}
          onChange={() => onChange(id, !completed)}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            ref={itemInputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={editTitle}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      )}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          disabled={isLoadingTodo !== null && isLoadingTodo === id}
          onClick={() => onDelete(id)}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoadingTodo === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
