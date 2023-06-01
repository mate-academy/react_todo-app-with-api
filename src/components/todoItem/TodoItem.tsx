import { useState, memo, useRef } from 'react';
import cn from 'classnames';

interface Props {
  title: string;
  id: number;
  completed: boolean;
  onDelete: (id: number) => void;
  onIsComplitedUpdate: (
    id: number,
    complitedCurrVal: boolean,
  ) => void;
  loadingID: number[];
  setEditingTodoId: (id: number | null) => void;
  editingTodoId: number | null;
  editTodo: (
    newTitle: string,
    id: number,
    setEditInput: (input: string) => void,
    title: string,
  ) => void;
}

export const TodoItem: React.FC<Props> = memo(({
  title,
  id,
  completed,
  onDelete,
  onIsComplitedUpdate,
  loadingID,
  setEditingTodoId,
  editingTodoId,
  editTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setEditingTodoId(id);
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleFormSubmit = (newTitle: string) => {
    if (newTitle === title) {
      setIsEditing(false);

      return;
    }

    editTodo(
      newTitle,
      id,
      setEditInput,
      title,
    );
    setIsEditing(false);
    setEditingTodoId(null);
  };

  return (
    <div className={cn('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => {
            onIsComplitedUpdate(
              id,
              completed,
            );
          }}
        />
      </label>

      {
        isEditing && editingTodoId === id
          ? (
            <label htmlFor="title_change">
              <input
                ref={inputRef}
                className="todo__title-field"
                type="text"
                value={editInput}
                onBlur={(event) => {
                  handleFormSubmit(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleFormSubmit(event.target.value);
                  }

                  if (event.key === 'Escape') {
                    setIsEditing(false);
                  }
                }}
                onChange={(event) => {
                  setEditInput(event.target.value);
                }}
              />
            </label>
          )
          : (
            <span
              onDoubleClick={handleDoubleClick}
              className="todo__title"
            >
              {title}
            </span>
          )
      }

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          onDelete(id);
        }}
      >
        ×
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': loadingID.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
