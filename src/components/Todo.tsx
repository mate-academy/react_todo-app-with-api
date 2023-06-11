import {
  KeyboardEvent, ChangeEvent, FormEvent, useEffect, useState,
} from 'react';
import { Todo } from '../types/TodoItem';

interface Props {
  todo: Todo;
  isTemp: boolean;
  handleDeleteTodo?: (ids: number[]) => void;
  handleUpdateTodo?: (ids: number[], value: Partial<Todo>) => void;
}

type EventType =
  ChangeEvent<HTMLInputElement>
  | FormEvent<HTMLFormElement>
  | KeyboardEvent<HTMLInputElement>;

export default function TodoItem({
  todo,
  isTemp = false,
  handleDeleteTodo,
  handleUpdateTodo,
}: Props) {
  const {
    completed, id, title,
  } = todo;

  const [isLoading, setIsLoading] = useState(isTemp);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleDelete = (selectedId: number) => {
    if (handleDeleteTodo) {
      handleDeleteTodo([selectedId]);
      setIsLoading(true);
    }
  };

  const handleToggle = () => {
    setIsLoading(true);
    if (handleUpdateTodo) {
      handleUpdateTodo([id], { completed: !completed });
    }
  };

  const handleEditTitle = (event: EventType) => {
    event.preventDefault();

    if (newTitle === '') {
      handleDelete(id);

      return;
    }

    if (handleUpdateTodo && title !== newTitle) {
      handleUpdateTodo([id], { title: newTitle });
      setIsLoading(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdition = () => {
    setNewTitle(title);
    setIsEditing(false);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(false);
    setIsEditing(false);
  }, [todo]);

  return (
    <div className={`todo ${completed ? 'completed' : ''}`} key={id}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => handleToggle()}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleEditTitle}>
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              className="todo__title-field"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={(event) => handleEditTitle(event)}
              onKeyUp={(event) => (
                event.key === 'Escape' && handleCancelEdition()
              )}
            />
          </form>
        )
        : (
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
              onClick={() => handleDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={`modal overlay ${isLoading ? 'is-active' : ''}`}>
        <div className="modal-background
          has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
}
