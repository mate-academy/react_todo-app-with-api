import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { UpdateTodoArgs } from '../types/UpdateTodoArgs';

interface Props {
  todo: Todo;
  removeTodo: (todoId: number) => void;
  updateTodo: (todoId: number, args: UpdateTodoArgs) => Promise<void>
}

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  updateTodo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { completed, title, id } = todo;

  const [changedTitle, setChangedTitle] = useState(title);

  const handleRemove = async () => {
    setIsLoading(true);

    await removeTodo(id);

    setIsLoading(false);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(event.target.value);
  };

  const handleBlur = async () => {
    setIsLoading(true);

    setIsEditing(false);
    await updateTodo(
      todo.id,
      { title: changedTitle },
    );

    setIsLoading(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!changedTitle.trim()) {
      removeTodo(id);
    }

    if (changedTitle.trim() === title) {
      setChangedTitle(title);
    }

    handleBlur();
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChecked = async () => {
    setIsLoading(true);

    await updateTodo(
      todo.id,
      { completed: !todo.completed },
    );

    setIsLoading(false);
  };

  const handleExitEditing = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Escape') {
      setChangedTitle(title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <section className="todoapp__main">
      <div className={cn('todo', {
        completed: todo.completed,
      })}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            onClick={handleChecked}
            checked={completed}
          />
        </label>

        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            onBlur={handleBlur}
          >
            <input
              type="text"
              className="todo__title-field"
              value={changedTitle}
              onChange={handleEditChange}
              onKeyDown={handleExitEditing}
              ref={inputRef}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={handleDoubleClick}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleRemove}
              disabled={isLoading}
            >
              ×
            </button>
            <div className={cn('modal overlay', {
              'is-active': isLoading || id === 0,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>

          </>
        )}

      </div>
    </section>
  );
};
