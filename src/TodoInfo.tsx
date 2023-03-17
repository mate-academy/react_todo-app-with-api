import classnames from 'classnames';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';

type Props = {
  todo: Todo,
  onDelete: (id: number) => void,
  onStatusChange: (todo: Todo) => void,
  onTitleChange: (todo: Todo, todoTitle: string) => void,
  loaderForHeader: boolean,
  setLoaderForHeader: (a: boolean) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  onStatusChange,
  onTitleChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loaderForHeader,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setLoaderForHeader,
}) => {
  const { id, title, completed } = todo;

  const [isBeingDeleted, setIsBeingDeleted] = useState(false);
  const [titleChanger, setTitleChanger] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [loader, setLoader] = useState(false);

  // useEffect(() => {
  //   const test = async () => {
  //     setLoader(true);
  //     await onStatusChange(todo);
  //     setLoader(false);
  //   };

  //   test();
  // }, [loaderForHeader]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleTitleChangesCancel = (
    event: React.KeyboardEvent,
  ) => {
    if (event.key === 'Escape') {
      setTitleChanger(false);
      setNewTitle(title);
    }
  };

  const handleFormSubmitAndBlur = async () => {
    setLoader(true);
    if (newTitle === '') {
      onDelete(id);
    } else {
      setTitleChanger(false);
      await onTitleChange(todo, newTitle);
    }

    setLoader(false);
  };

  return (
    <li
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
          onChange={() => {
            // setLoaderForHeader(true);
            onStatusChange(todo);
          }}
        />
      </label>

      {titleChanger ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleFormSubmitAndBlur();
          }}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleFormSubmitAndBlur}
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
    </li>
  );
};
