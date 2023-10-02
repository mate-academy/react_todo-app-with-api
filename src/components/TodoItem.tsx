/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
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
  todo, removeTodo, isLoading, onTodoClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editedTitle.trim()) {
      removeTodo(todo.id);
    } else if (editedTitle !== todo.title) {
      const updatedTodo = { ...todo, title: editedTitle };

      setEditedTitle(updatedTodo.title);
      setIsEditing(false);
      updateTodos(updatedTodo)
        .catch(() => setErrorMessage(Errors.update));
    } else {
      setIsEditing(false);
    }
  };

  const handleEscapeKey = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEditedTitle(todo.title);
      setIsEditing(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(event.target.value);
  };

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
        <form onSubmit={handleEditSubmit}>
          <input
            data-cy="TodoEditInput"
            type="text"
            className="todo__title-field"
            value={editedTitle}
            onChange={handleInputChange}
            onBlur={handleEditSubmit}
            onKeyUp={handleEscapeKey}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => !isLoading && removeTodo(todo.id)}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={`modal overlay ${isLoading ? 'is-active' : ''}`}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>

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
