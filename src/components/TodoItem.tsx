/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { Todo } from '../types/Todo';
import { updateTodos } from '../api/todos';
import { Errors } from '../types/Errors';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  isLoading: boolean;
  onTodoClick: (id: number, completed: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  isLoading,
  onTodoClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleEditSubmit = () => {
    if (!editedTitle.trim()) {
      removeTodo(todo.id);
    } else if (editedTitle !== todo.title) {
      const updatedTodo = { ...todo, title: editedTitle };

      setEditedTitle(updatedTodo.title);
      setIsEditing(false);

      updateTodos(updatedTodo)
        .then(() => {
          setErrorMessage('');
        })
        .catch(() => {
          setErrorMessage(Errors.update);
        });
    } else {
      setIsEditing(false);
    }
  };

  const handleTitleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTitleBlur = () => {
    handleEditSubmit();
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleEditSubmit();
      } else if (event.key === 'Escape') {
        setEditedTitle(todo.title);
        setIsEditing(false);
      }
    };

    if (isEditing) {
      window.addEventListener('keydown', handleKeyPress);
    } else {
      window.removeEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isEditing, editedTitle, todo]);

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label
        data-cy="TodoStatus"
        className="todo__status-label"
      >
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onTodoClick(todo.id, todo.completed)}
        />
        <span
          className="todo__status-checkbox"
          onClick={() => onTodoClick(todo.id, todo.completed)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={(e) => {
          e.preventDefault(); handleEditSubmit();
        }}
        >
          <input
            data-cy="TodoEditInput"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleBlur}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTitleDoubleClick}
          >
            {editedTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => !isLoading && removeTodo(todo.id)}
          >
            ×
          </button>

          {errorMessage && (
            // eslint-disable-next-line max-len
            <div className="notification is-danger is-light has-text-weight-normal">
              {errorMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
};
