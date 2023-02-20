import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  deleteHandler?: (todoId: number) => void,
  isProcessed: boolean,
  onUpdate?: (todoId: number, title?: string) => void,
};

export const TodoAppTodo: React.FC<Props> = ({
  todo,
  deleteHandler = () => {},
  isProcessed,
  onUpdate = () => {},
}) => {
  const [isFormUpdate, setIsFormUpdate] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const updateHandler = () => {
    if (newTitle.length === 0) {
      deleteHandler(todo.id);
    }

    if (newTitle !== todo.title && newTitle.length > 0) {
      onUpdate(todo.id, newTitle);
    }

    setIsFormUpdate(false);
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onUpdate(todo.id)}
        />
      </label>

      {isFormUpdate ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateHandler();
          }}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onChange={(event) => setNewTitle(event.target.value)}
            onBlur={() => updateHandler()}
            onKeyUp={(event) => {
              if (event.key === 'Escape') {
                setIsFormUpdate(false);
                setNewTitle(todo.title);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsFormUpdate(true)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => deleteHandler(todo.id)}
          >
            &times;
          </button>
        </>
      )}

      <div
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isProcessed },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
