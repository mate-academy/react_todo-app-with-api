import { useEffect, useRef, useState } from 'react';
import { Errors } from '../types/Error';
import classNames from 'classnames';
import { setTodoTitle } from '../api/todos';

type Props = {
  title: string;
  id: number;
  completed: boolean;
  loader: boolean;
  deleteCurrentTodo: (id: number) => void;
  updateTodoTitle: (todoId: number, newTitle: string) => void;
  setError: (error: Errors | null) => void;
  toggleCompleted: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  title,
  id,
  completed,
  loader,
  deleteCurrentTodo,
  updateTodoTitle,
  setError,
  toggleCompleted,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  useEffect(() => {
    setLoading(loader);
  }, [loader]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleDoubleClick = () => {
    setEditedTitle(title.trim().replace(/\s+/g, ' '));
    setEditing(true);
  };

  const handleSubmit = async () => {
    const trimmedEditedTitle = editedTitle.trim();

    try {
      setLoading(true);

      if (trimmedEditedTitle !== '' && trimmedEditedTitle !== title) {
        await setTodoTitle({ id, title: trimmedEditedTitle });
        updateTodoTitle(id, trimmedEditedTitle);
      } else if (trimmedEditedTitle === '') {
        deleteCurrentTodo(id);

        return;
      }

      setEditing(false);
    } catch {
      setError(Errors.Update);
      setEditing(true);
      setEditedTitle(title);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedTitle(title);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

  const changeCompleted = async () => {
    try {
      setLoading(true);

      await toggleCompleted(id);
    } catch {
      setError(Errors.Update);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = async () => {
    if (editing) {
      await handleSubmit();
    }

    if (!loading && editing) {
      setEditing(false);
    }
  };

  return (
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          aria-label="Status todo"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={changeCompleted}
        />
      </label>

      {editing ? (
        <input
          ref={inputRef}
          type="text"
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editedTitle}
          autoFocus
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => deleteCurrentTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${loading ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
