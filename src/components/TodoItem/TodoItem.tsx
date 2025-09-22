/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import cls from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useState } from 'react';

type TodoItemProps = {
  todo: Todo;
  onDeleteItem: (todoId: number) => void;
  loader: boolean | number; // Optional prop to indicate loading state
  onToggleCompleted: (todoId: number, completed: boolean) => Promise<void>; // Function to toggle completed status
  onEditTitle: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDeleteItem,
  loader,
  onToggleCompleted,
  onEditTitle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleBlur = () => {
    if (!isEditing) {
      return;
    }

    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(false);
      setEditedTitle(todo.title);

      return;
    }

    onEditTitle(todo.id, trimmedTitle)
      .then(() => {
        setIsEditing(false);
      })
      .catch(() => {
        setIsEditing(true);
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditedTitle(todo.title); // Revert to original title
      setIsEditing(false);
    }
  };

  return (
    <div data-cy="Todo" className={cls('todo', { completed: todo.completed })}>
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          id={`${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => {
            onToggleCompleted(todo.id, event.target.checked);
          }}
        />
      </label>

      {isEditing ? (
        // /* This form is shown instead of the title and remove button */
        <form
          onSubmit={e => {
            e.preventDefault();
            handleBlur();
          }}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setEditedTitle(todo.title);
            }}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className={cls('todo__remove')}
            data-cy="TodoDelete"
            onClick={() => onDeleteItem(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cls('modal overlay', { 'is-active': loader })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
