/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todosToDelete?: number[];
  todo: Todo;
  onTodosToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  onUpdate: (data: Todo) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todosToDelete,
  todo,
  onTodosToDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const todoTitleUpdate = useRef<HTMLInputElement>(null);

  const handleUpdate = () => {
    if (!newTitle) {
      setIsEditing(true);
      todoTitleUpdate.current?.focus();
      onTodosToDelete(currentTodos => [...currentTodos, todo.id]);

      return;
    }

    if (newTitle.trim() === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsUpdating(true);

    const todoToUpdate = {
      ...todo,
      title: newTitle.trim(),
    };

    onUpdate(todoToUpdate)
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        setIsEditing(true);
        todoTitleUpdate.current?.focus();
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };

  const handleToggle = () => {
    setIsUpdating(true);

    const todoToUpdate = {
      ...todo,
      title: newTitle.trim(),
      completed: !todo.completed,
    };

    onUpdate(todoToUpdate)
      .then(() => {
        setIsEditing(false);
        setIsUpdating(false);
      })
      .catch(() => {
        setIsEditing(false);
        setIsUpdating(false);
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value.trimStart());
  };

  const handleDoubleClick = () => {
    setNewTitle(todo.title);
    setIsEditing(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleUpdate();
  };

  const handleEscape: React.KeyboardEventHandler<HTMLInputElement> = event => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    todoTitleUpdate.current?.focus();
  }, [isEditing, isUpdating]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
        />
      </label>

      {isEditing ? (
        <>
          <form onSubmit={handleSubmit} onBlur={handleSubmit}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleChange}
              ref={todoTitleUpdate}
              onKeyUp={handleEscape}
            />
          </form>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() =>
              onTodosToDelete(currentTodos => [...currentTodos, todo.id])
            }
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            !todo.id || todosToDelete?.includes(todo.id) || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
