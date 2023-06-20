import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

type Props = {
  todo: Todo,
  onError: (isError: Error) => void,
  removeTodo: (todoId: number) => void,
  todoIdUpdate: number[],
  toggleCompletedTodo: (todoId: number, completed: boolean) => void,
  changeName: (todoId: number, title: string) => void
};

export const TodoInfo: React.FC<Props> = ({
  todo, onError, removeTodo, todoIdUpdate, toggleCompletedTodo, changeName,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [isEditedTitle, setIsEditedTitle] = useState(title);

  const handleChange = () => {
    if (!isEditedTitle) {
      removeTodo(id);
    }

    if (isEditedTitle !== title) {
      changeName(id, isEditedTitle);
    }

    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsEditedTitle(title);
      setIsEditing(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleChange();
    }
  };

  return (
    <li
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={() => toggleCompletedTodo(todo.id, !todo.completed)}
          defaultChecked
        />
      </label>

      {isEditing ? (
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value={isEditedTitle}
          onChange={event => setIsEditedTitle(event.target.value)}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyPress}
          onBlur={handleChange}
        />
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              onError(Error.UPDATE);
            }}
          >
            {isEditedTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              onError(Error.DELETE);
              removeTodo(id);
            }}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal overlay',
        { 'is-active': todoIdUpdate.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader is-loading" />
      </div>
    </li>
  );
};
