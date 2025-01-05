import React, { useState, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onUpdateTodo: (todo: Todo) => Promise<boolean>;
  onDeleteTodo: (id: number) => Promise<boolean>;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onUpdateTodo,
  onDeleteTodo,
  isLoading,
}) => {
  const { id, completed, title } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const editTitleRef = useRef<HTMLInputElement>(null);

  const handleEditTodo = async () => {
    const trimmedTitle = editTitle.trim();

    if (todo.title === trimmedTitle) {
      setIsEditing(false);

      return;
    }

    if (!trimmedTitle) {
      const success = await onDeleteTodo(todo.id);

      if (!success) {
        editTitleRef.current?.focus();
      }

      return;
    }

    const success = await onUpdateTodo({ ...todo, title: trimmedTitle });

    if (success) {
      setIsEditing(false);
    } else {
      editTitleRef.current?.focus();
    }
  };

  const handleToggleTodoStatus = () => {
    const todoToUpdate = { ...todo, completed: !todo.completed };

    onUpdateTodo(todoToUpdate);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleEditTodo();
    }

    if (event.key === 'Escape') {
      setEditTitle(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggleTodoStatus}
        />
      </label>
      {isEditing ? (
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={editTitle}
          onChange={event => setEditTitle(event.target.value)}
          onBlur={handleEditTodo}
          onKeyUp={handleKeyUp}
          ref={editTitleRef}
          autoFocus
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
            disabled={isLoading}
          >
            ×
          </button>
        </>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
