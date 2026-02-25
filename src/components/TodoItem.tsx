/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface TodoItemProps {
  todo: Todo;
  isLoading: boolean;
  onDelete: (id: number) => void;
  onUpdate: (todo: Todo, data: Partial<Todo>) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isLoading,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const editFieldRef = useRef<HTMLInputElement>(null);

  const checkTitle = () => {
    if (isLoading) {
      return;
    }

    const trimmedNew = newTitle.trim();

    if (trimmedNew === '') {
      onDelete(todo.id);

      return;
    }

    if (trimmedNew === todo.title) {
      setIsEditing(false);
    } else {
      onUpdate(todo, { title: trimmedNew })
        .then(() => {
          setIsEditing(false);
        })
        .catch(() => {
          editFieldRef.current?.focus();
        });
    }
  };

  const handleRename = (event: React.FormEvent) => {
    event.preventDefault();
    checkTitle();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setNewTitle(todo.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      editFieldRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          disabled={isLoading}
          checked={todo.completed}
          onChange={() => onUpdate(todo, { completed: !todo.completed })}
        />
      </label>

      {isEditing ? (
        <form onSubmit={event => handleRename(event)}>
          <input
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={newTitle}
            onKeyUp={event => handleKeyUp(event)}
            onBlur={checkTitle}
            disabled={isLoading}
            onChange={event => setNewTitle(event.target.value)}
            placeholder="Empty todo will be deleted"
            ref={editFieldRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
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
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
