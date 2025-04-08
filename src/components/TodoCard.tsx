import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isDefaultLoading?: boolean | undefined;
  onDelete: (id: number) => Promise<void>;
  onToggle: (todo: Todo) => Promise<void>;
  onEdit: (todo: Todo, newTitle: string) => Promise<void>;
};

export const TodoCard: React.FC<Props> = ({
  todo,
  isDefaultLoading = false,
  onDelete,
  onToggle,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(isDefaultLoading);
  const [title, setTitle] = useState(todo.title);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTitle(todo.title);
        setIsEditing(false);
      }
    };

    window.addEventListener('keyup', handleEsc);

    return () => window.removeEventListener('keyup', handleEsc);
  }, []);

  const handleSubmit = () => {
    if (title === todo.title) {
      setIsEditing(false);

      return;
    }

    setIsLoading(true);
    if (!title.trim()) {
      onDelete(todo.id)
        .then(() => {
          setIsLoading(false);
          setIsEditing(false);
        })
        .catch(() => {
          setIsLoading(false);
        });

      return;
    }

    onEdit(todo, title.trim())
      .then(() => {
        setIsLoading(false);
        setIsEditing(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      onDoubleClick={() => setIsEditing(true)}
    >
      <label className="todo__status-label">
        <span style={{ display: 'none' }}>Mark as completed</span>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          title={`status ${todo.id}`}
          checked={todo.completed}
          onChange={() => {
            setIsLoading(true);
            onToggle(todo).then(() => setIsLoading(false));
          }}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            handleSubmit();
          }}
          ref={formRef}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={title}
            onChange={event => setTitle(event.target.value)}
            onBlur={handleSubmit}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => {
              setIsLoading(true);
              onDelete(todo.id).finally(() => {
                setIsLoading(false);
              });
            }}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
