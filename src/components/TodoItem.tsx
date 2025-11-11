/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import * as todosService from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  isProcessed: boolean;
  isLoading: boolean;
  setProcessings?: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos?: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError?: (message: ErrorMessage) => void;
  onDelete?: (todoId: number) => void;
  onUpdate?: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setProcessings,
  setTodos,
  showError,
  isProcessed,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const saveChanges = async () => {
    const newTitle = editTitle.trim();

    if (newTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (newTitle === '') {
      onDelete?.(todo.id);

      return;
    }

    try {
      setProcessings?.(prev => [...prev, todo.id]);

      await todosService.updateTodo({
        ...todo,
        title: newTitle,
      });

      setTodos?.(prev =>
        prev.map(current =>
          current.id === todo.id ? { ...current, title: newTitle } : current,
        ),
      );
    } catch {
      showError?.(ErrorMessage.UpdateError);
    } finally {
      setProcessings?.(prev => prev.filter(id => id !== todo.id));

      setIsEditing(false);
    }
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    saveChanges();
  };

  const handleBlur = () => {
    saveChanges();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleEditTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditTitle(event.target.value);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate?.(todo)}
          checked={todo.completed}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="edit"
            data-cy="TodoTitleField"
            value={editTitle}
            onChange={handleEditTitleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
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
        className={cn('modal overlay', {
          'is-active': isProcessed || isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
