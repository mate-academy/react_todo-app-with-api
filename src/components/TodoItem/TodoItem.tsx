import React, { useState } from 'react';
import classNames from 'classnames';
import { HandleTodoEdit, Todo } from '../../types';

type Props = {
  todo: Todo,
  onDelete: (id: number) => void,
  idsToDelete: number[],
  idsToToggle: number[],
  onToggle: (todo: Todo) => void,
  todoOnEdit: Todo | null,
  setTodoOnEdit: (todo: Todo | null) => void,
  handleTodoEdit: HandleTodoEdit,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  idsToDelete,
  idsToToggle,
  onToggle,
  todoOnEdit,
  setTodoOnEdit,
  handleTodoEdit,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [isBeingUpdated, setIsBeingUpdated] = useState(false);

  const isBeingDeleted = idsToDelete.includes(todo.id);
  const isBeingToggled = idsToToggle.includes(todo.id);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleTodoEdit(todo, title, setIsBeingUpdated);
  };

  const handleKeyUp = (key: string): void => {
    if (key === 'Escape') {
      setTodoOnEdit(null);
    }
  };

  return (
    <div
      key={todo.id}
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
        />
      </label>

      {todoOnEdit?.id === todo.id
        ? (
          <form
            onSubmit={(event) => handleFormSubmit(event)}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyUp={(event) => handleKeyUp(event.key)}
              onBlur={() => handleTodoEdit(todo, title, setIsBeingUpdated)}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setTodoOnEdit(todo)}
            >
              {todo.title}
            </span>

            {/* Remove button appears only on hover */}
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(todo.id)}
            >
              ×
            </button>
          </>
        )}

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal overlay', {
        'is-active': isBeingDeleted || isBeingToggled || isBeingUpdated,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
