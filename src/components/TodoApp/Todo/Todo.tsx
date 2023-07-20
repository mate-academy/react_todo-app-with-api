import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  title: string,
  id: number,
  completed: boolean,
  onDelete?: (todoId: number) => void,
  isUpdatingTodoId?: number,
  handleUpdateTodo?: (
    title: string,
    todoId: number,
    completed: boolean,
  ) => void,
  isClicked?: boolean,
  setIsClicked?: (param: boolean) => void,
  isBeingEdited?: number,
  setIsBeingEdited?: (param: number) => void,
  handleEditedTodoFormSubmit?: (
    title: string,
    todoId: number,
    completed: boolean,
  ) => void,
};

export const Todo: React.FC<Props> = ({
  title,
  id,
  completed,
  onDelete = () => {},
  isUpdatingTodoId = 0,
  handleUpdateTodo = () => {},
  isClicked = false,
  setIsClicked = () => {},
  isBeingEdited = false,
  setIsBeingEdited = () => {},
  handleEditedTodoFormSubmit = () => {},
}) => {
  const [editedTitleValue, setEditedTitleValue]
    = useState('');

  const handleTodoToggle = () => {
    setIsClicked(!isClicked);
    handleUpdateTodo(title, id, !completed);
  };

  const handleDoubleClick = (todoId: number) => {
    setIsBeingEdited(todoId);
    setEditedTitleValue(title);
  };

  return (
    <>
      {isBeingEdited === id ? (
        <div className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked={completed}
              onClick={handleTodoToggle}
            />
          </label>

          <form
            onSubmit={event => {
              event.preventDefault();
              handleEditedTodoFormSubmit(editedTitleValue, id, completed);
            }}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={editedTitleValue}
              onChange={event => setEditedTitleValue(event.target.value)}
            />
          </form>

          <div className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ) : (
        <div
          className={
            classNames(
              'todo',
              {
                completed,
              },
            )
          }
          key={id}
          onDoubleClick={() => handleDoubleClick(id)}
        >
          <label
            className="todo__status-label"
          >
            <input
              type="checkbox"
              className="todo__status"
              checked={completed}
              onClick={handleTodoToggle}
            />
          </label>

          <span
            className="todo__title"
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>

          <div
            className={classNames(
              'modal overlay',
              {
                'is-active': isUpdatingTodoId === id,
              },
            )}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
