import { useEffect, useState } from 'react';
import { Errors } from '../types/Error';

type Props = {
  title: string;
  id: number;
  completed: boolean;
  loader: boolean;
  deleteCurrentTodo: (id: number) => void;
  editTodoTitle: (id: number, newTitle: string) => void;
  setError: (error: Errors | null) => void;
};

export const TodoItem: React.FC<Props> = ({
  title,
  id,
  completed,
  loader,
  deleteCurrentTodo,
  editTodoTitle,
  setError,
}) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  useEffect(() => {
    setLoading(loader);
  }, [loader]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleSubmit = async () => {
    // setEditing(false);
    const trimmedEditedTitle = editedTitle.trim();

    if (trimmedEditedTitle !== '' && trimmedEditedTitle !== title) {
      setLoading(true);
      try {
        await editTodoTitle(id, trimmedEditedTitle);
        setEditing(false);
      } catch {
        setError(Errors.Update);
        setEditing(true);
      }

      setLoading(false);
    } else if (trimmedEditedTitle === '') {
      deleteCurrentTodo(id);

      return;
    }

    setEditing(false);
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

  return (
    <div
      key={id}
      data-cy="Todo"
      className={`todo ${completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          aria-label="Status todo"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      {editing ? (
        <input
          type="text"
          data-cy="TodoTitleField"
          className="todo__title-field"
          value={editedTitle}
          autoFocus
          onChange={handleChange}
          onKeyUp={handleKeyUp}
          onBlur={handleSubmit}
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
