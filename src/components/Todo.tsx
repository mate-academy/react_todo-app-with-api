/* eslint-disable jsx-a11y/no-autofocus */
import React, {
  ChangeEvent, FormEvent, useState, useEffect,
} from 'react';
import { Todo as TypeTodo } from '../types/Todo';

interface TodoProps {
  todo: TypeTodo,
  handleRemoveTodos?: (idsToRemove: number[]) => void;
  temp: boolean;
  handleUpdateTodos?: (ids: number[], value: Partial<TypeTodo>) => void;
}

export const Todo: React.FC<TodoProps> = ({
  todo,
  handleRemoveTodos,
  temp = false,
  handleUpdateTodos,
}) => {
  const { id, title, completed } = todo;
  const [loading, setLoading] = useState(temp);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleRemoveButton = (todoId: number) => {
    if (handleRemoveTodos) {
      handleRemoveTodos([todoId]);
      setLoading(true);
    }
  };

  const handleTitleEdit = (
    event:
    FormEvent<HTMLFormElement>
    | ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    if (newTitle === '') {
      handleRemoveButton(id);

      return;
    }

    if (handleUpdateTodos && title !== newTitle) {
      setLoading(true);
      handleUpdateTodos([id], { title: newTitle });
    } else {
      setEditing(false);
    }
  };

  const handleChangeStatus = () => {
    setLoading(true);
    if (handleUpdateTodos) {
      handleUpdateTodos([id], { completed: !completed });
    }
  };

  useEffect(() => {
    setLoading(false);
    setEditing(false);
  }, [todo]);

  return (
    <div
      className={`todo ${completed ? 'completed' : ''}`}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => handleChangeStatus()}
        />
      </label>

      {editing
        ? (
          <form onSubmit={handleTitleEdit}>
            <input
              autoFocus
              type="text"
              className="todo__title-field"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
              onBlur={(event) => handleTitleEdit(event)}
              onKeyUp={(event) => (
                event.key === 'Escape' && handleTitleEdit(event)
              )}
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setEditing(true)}
            >
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => handleRemoveButton(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={`modal overlay ${loading ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
