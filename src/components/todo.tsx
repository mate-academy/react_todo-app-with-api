import { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';

export const ToDo = ({
  todo,
  onDelete,
  onUpdate,
  isLoading,
}: {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (todo: Todo) => Promise<void>;
  isLoading: boolean;
}) => {
  const [inputValue, setInputValue] = useState(todo.title);
  const [isEditing, setIsEditing] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmittedRef = useRef(false);

  useEffect(() => {
    if (isEditing) {
      setInputValue(todo.title);
      isSubmittedRef.current = false;
    }
  }, [isEditing, todo.title]);

  const handleSave = async () => {
    const trimmedTitle = inputValue.trim();

    if (trimmedTitle === todo.title) {
      setIsEditing(null);

      return;
    }

    if (!trimmedTitle) {
      try {
        await onDelete(todo.id);
      } catch {
        isSubmittedRef.current = false;
      }

      return;
    }

    try {
      await onUpdate({ ...todo, title: trimmedTitle });
      setIsEditing(null);
    } catch {
      isSubmittedRef.current = false;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    isSubmittedRef.current = true;
    handleSave();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          aria-label="Toggle todo status"
          disabled={isLoading}
          onChange={e => onUpdate({ ...todo, completed: e.target.checked })}
        />
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(todo);
            setInputValue(todo.title);
          }}
        >
          {todo.title}
        </span>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            className="todo__title-field"
            type="text"
            value={inputValue}
            disabled={isLoading}
            onChange={e => setInputValue(e.target.value)}
            onBlur={() => {
              if (!isSubmittedRef.current) {
                handleSave();
              }
            }}
            onKeyUp={e => {
              if (e.key === 'Escape') {
                setInputValue(todo.title);
                setIsEditing(null);
                isSubmittedRef.current = true;
              }
            }}
          />
        </form>
      )}
      {/* Remove button appears only on hover */}
      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isLoading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
