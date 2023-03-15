import classnames from 'classnames';
import React, { useState } from 'react';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo,
  onDelete: (id: number) => void,
  onStatusChange: (todo: Todo) => void,
  onTitleChange: (todo: Todo, todoTitle: string) => void,
  loader: boolean,
  // setLoader: (loader: boolean) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  onStatusChange,
  onTitleChange,
  loader,
  // setLoader,
}) => {
  const { id, title, completed } = todo;

  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [titleChanger, setTitleChanger] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleTitleOnBlur = () => {
    setNewTitle(newTitle);
    onTitleChange(todo, newTitle);
    setTitleChanger(false);
  };

  const handleTitleChangesCancel = (
    event: React.KeyboardEvent,
  ) => {
    if (event.key === 'Escape') {
      setTitleChanger(false);
      setNewTitle(title);
    }
  };

  const handleFormSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTitle === '') {
      onDelete(id);
      setIsBeingDeleted(true);
    } else {
      setIsBeingDeleted(true);
      onTitleChange(todo, newTitle);
      setTitleChanger(false);
    }
  };

  return (
    <div
      className={classnames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onStatusChange(todo)}
        />
      </label>

      {titleChanger ? (
        <form
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleOnBlur}
            onKeyUp={handleTitleChangesCancel}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setTitleChanger(true)}
          >
            {newTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              onDelete(id);
              setIsBeingDeleted(true);
            }}
          >
            ×
          </button>
        </>
      )}

      <div className={classnames(
        'modal overlay',
        { 'is-active': isBeingDeleted || loader },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
