/* eslint-disable max-len */
import React, { useState, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { updateTodo } from '../../api/todos';
import { handleError } from '../../handleError';
import { ErrorMessage } from '../../types/ErrorMessage';

type TodoItemProps = {
  todo: Todo;
  handleDelete: (todoId: number) => void;
  onStatusChange: (todoId: number, completed: boolean) => void;
  onTodoUpdate: () => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo, handleDelete, onStatusChange, onTodoUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [errorMessage, setErrorMessage] = useState('');
  const editRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    onStatusChange(todo.id, todo.completed);
    if (newTitle.trim() === '') {
      handleDelete(todo.id);
    } else if (newTitle !== todo.title) {
      try {
        await updateTodo(todo.id, {
          title: newTitle.trim(),
        });
        onStatusChange(todo.id, todo.completed);
        onTodoUpdate();
      } catch {
        handleError(setErrorMessage, ErrorMessage.noUpdateTodo);
      }
    }
  };

  const handleBlur = () => {
    if (newTitle !== todo.title) {
      if (newTitle.trim() === '') {
        handleDelete(todo.id);
      } else {
        handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLInputElement>);
      }
    }

    setIsEditing(false);
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onStatusChange(todo.id, !todo.completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
            ref={editRef}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={handleDoubleClick}
        >
          {todo.title}
        </span>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': todo.editing })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
