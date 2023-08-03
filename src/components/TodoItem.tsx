import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo?:() => void;
  onUpdateTodo?: (todoId: number, args: Partial<Todo>) => Promise<void>,
  isUpdating: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo = () => {},
  onUpdateTodo = () => {},
  isUpdating,

}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdatedTitle(todo.title);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!updatedTitle.trim()) {
      onDeleteTodo();
    }

    if (updatedTitle === todo.title) {
      setIsEditing(false);
    } else {
      onUpdateTodo(todo.id, { title: updatedTitle });
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        className={cn('todo', {
          completed: todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => onUpdateTodo(
              todo.id, { completed: !todo.completed },
            )}
          />
        </label>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              onBlur={handleSubmit}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo()}
            >
              ×
            </button>
          </>
        )}

        <div
          className={cn('modal overlay', {
            'is-active': isUpdating,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
