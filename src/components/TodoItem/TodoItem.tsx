import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
  loading: boolean;
  onDeleteTodo: (todoId: number) => void;
  onToggleTodo: (todoId: number, completed: boolean) => void;
  onEditTodo: (todoId: number, newTitle: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, completed, title },
  loading,
  onDeleteTodo,
  onToggleTodo,
  onEditTodo,
}) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleStatusChange = () => {
    onToggleTodo(id, !completed);
  };

  const handleDeleteClick = () => {
    onDeleteTodo(id);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const handleTodoEdit = () => {
    if (editedTitle.trim() === '') {
      onDeleteTodo(id);
    } else if (editedTitle !== title) {
      onEditTodo(id, editedTitle);
    }

    setEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleTodoEdit();
    } else if (event.key === 'Escape') {
      setEditedTitle(title);
      setEditing(false);
    }
  };

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  return (
    <li className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleStatusChange}
          disabled={loading}
        />
      </label>

      {!editing ? (
        <>
          <span className="todo__title" onDoubleClick={() => setEditing(true)}>
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDeleteClick}
            disabled={loading}
          >
            ×
          </button>
        </>
      ) : (
        <input
          type="text"
          className="todo__title-field"
          value={editedTitle}
          onChange={handleTitleChange}
          onBlur={handleTodoEdit}
          onKeyUp={handleKeyUp}
          ref={inputRef}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      )}

      {loading && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </li>
  );
};
