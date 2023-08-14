import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isLoading: boolean,
  removeTodo: (id: number) => void,
  updateTodo: (changedTodo: Todo) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  updateTodo,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTitle, setEditedTitle] = useState<string>(title);
  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editInput.current) {
      editInput.current.focus();
    }
  }, [isEditing]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimedTitle = editedTitle.trim();

    if (!trimedTitle) {
      removeTodo(id);
    } else if (trimedTitle !== title) {
      updateTodo({ ...todo, title: trimedTitle });
    }

    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <li
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => updateTodo({ ...todo, completed: !completed })}
        />
      </label>
      {!isEditing
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => {
                setIsEditing(true);
                setEditedTitle(title);
              }}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => removeTodo(id)}
            >
              ×
            </button>
          </>
        )
        : (
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              ref={editInput}
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={handleFormSubmit}
              onKeyUp={handleKeyUp}
            />
          </form>
        )}

      <div
        className={cn(
          'modal',
          'overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
