import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { Todo } from '../types/Todo';

interface Props {
  title: string,
  id: number,
  completed: boolean,
  isLoading: boolean,
  deleteTodo: (id: number) => void,
  updateTodo: (id: number, data: Partial<Todo>) => void,
}

export const TodoItem: React.FC<Props> = ({
  id, completed, title, deleteTodo, isLoading = false, updateTodo,
}) => {
  const [loader, setLoader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const cancelRenaming = useCallback(() => {
    setNewTitle(title);
    setIsEditing(false);
  }, [title]);

  useEffect(() => {
    setLoader(isLoading);

    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelRenaming();
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isLoading, isEditing, cancelRenaming]);

  const handleDelete = (todoId: number) => {
    deleteTodo(todoId);
  };

  const handleComplete = () => {
    updateTodo(id, { id, completed: !completed });
  };

  const handleRename
    = (e: React.FormEvent<HTMLFormElement | HTMLDivElement>) => {
      e.preventDefault();

      if (newTitle === title) {
        setIsEditing(false);

        return;
      }

      if (newTitle.trim() === '') {
        setIsEditing(false);
        deleteTodo(id);

        return;
      }

      updateTodo(id, { id, title: newTitle });
      setIsEditing(false);
    };

  return (
    <div
      data-cy="Todo"
      className={`todo ${completed && 'completed'}`}
      key={id}
      onDoubleClick={() => setIsEditing(true)}
      onBlur={handleRename}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleComplete}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={(e) => handleRename(e)}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
          />
        </form>
      )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(id)}
            >
              ×
            </button>

            <div
              data-cy="TodoLoader"
              className={`modal overlay ${
                loader && 'is-active'
              }`}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </>
        )}
    </div>
  );
};
