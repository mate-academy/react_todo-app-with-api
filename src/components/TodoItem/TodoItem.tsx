import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo: (id: number) => void,
  onUpdateTodo: (id: number, data: Partial<Todo>) => void,
  isLoading: boolean,
}

export const TodoItem: React.FC<Props> = (
  {
    todo,
    onDeleteTodo,
    onUpdateTodo,
    isLoading,
  },
) => {
  const { title, completed, id } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const cancelEditing = () => {
    setIsEditing(false);
    setTodoTitle(title);
  };

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle) {
      onDeleteTodo(id);
    }

    if (todoTitle === title) {
      cancelEditing();
    }

    onUpdateTodo(id, { title: todoTitle });
    setIsEditing(false);
  };

  useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    document.addEventListener('keyup', handleEsc);

    return () => {
      document.removeEventListener('keyup', handleEsc);
    };
  }, [isEditing]);

  return (
    <div className={classNames(
      'todo',
      { completed },
    )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdateTodo(id, { completed: !completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmit}>
            <input
              className="todo__title-field"
              type="text"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              ref={inputRef}
              onBlur={handleSubmit}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => onDeleteTodo(id)}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal overlay', { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
