import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types';

type Props = {
  todo: Todo,
  onDelete: () => void,
  onUpdate: (fields: Partial<Todo>) => void,
  beingProcessed?: boolean,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  onUpdate,
  beingProcessed = false,
}) => {
  const { title, completed } = todo;
  const [beingEdited, setBeingEdited] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const todoRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = () => setBeingEdited(true);
  const finishEditing = () => setBeingEdited(false);

  useEffect(() => {
    todoRef.current?.addEventListener('dblclick', startEditing);

    return () => todoRef.current?.removeEventListener('dblclick', startEditing);
  }, []);

  useEffect(() => {
    if (beingEdited) {
      inputRef.current?.focus();
    }
  }, [beingEdited]);

  const handleToggle = () => {
    onUpdate({ completed: !todo.completed });
  };

  const handleRename = () => {
    if (!newTitle) {
      onDelete();

      return;
    }

    if (title !== newTitle) {
      onUpdate({ title: newTitle });
    }

    finishEditing();
  };

  return (
    <div
      ref={todoRef}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {beingEdited
        ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleRename();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
              onBlur={handleRename}
            />
          </form>
        ) : (
          <>
            <span className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={onDelete}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': beingProcessed },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
