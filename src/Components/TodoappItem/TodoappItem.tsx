/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (id: number) => void;
  isLoading: boolean;
  setTodosError: (error: string) => void;
  onTodoUpdate: (todo: Todo) => Promise<void>
};

export const TodoappItem: React.FC<Props> = ({
  todo,
  onDelete,
  isLoading,
  setTodosError,
  onTodoUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const newTitleField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && newTitleField.current) {
      newTitleField.current.focus();
    }
  }, [isEditing]);

  const handleDeleteClick = async () => {
    try {
      if (onDelete) {
        await onDelete(todo.id);
      }
    } catch (error) {
      setTodosError('Unable to delete a todo');
    }
  };

  const handleToggleStatus = () => {
    onTodoUpdate?.({
      ...todo,
      completed: !todo.completed,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTitle.length) {
      onDelete?.(todo.id);
    }

    if (todo.title === newTitle) {
      setIsEditing(false);

      return;
    }

    try {
      const newTodo = {
        ...todo,
        title: newTitle.trim(),
      };

      onTodoUpdate?.(newTodo);

      setIsEditing(false);
    } catch {
      setTodosError('Some error occure while updating!');
    }
  };

  return (
    <div
      className={cn('todo', { completed: todo.completed })}
      data-cy="Todo"
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleStatus}
        />
      </label>

      {!isEditing ? (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDeleteClick}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} onBlur={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={newTitleField}
            value={newTitle}
            onChange={(event) => {
              setNewTitle(event.target.value);
            }}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                setIsEditing(false);
                setNewTitle(todo.title);
              }
            }}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
