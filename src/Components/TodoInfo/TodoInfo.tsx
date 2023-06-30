import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  removeTodo: (todoId: number) => void,
  todoIdUpdate: number[],
  toggleCompletedTodo: (todoId: number, completed: boolean) => void,
  changeName: (todoId: number, title: string) => void
};

export const TodoInfo: React.FC<Props> = ({
  todo, removeTodo, todoIdUpdate, toggleCompletedTodo, changeName,
}) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [isEditedTitle, setIsEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkTitle = async (NewTitle: string) => {
    if (!isEditedTitle) {
      removeTodo(id);
    }

    if (isEditedTitle !== NewTitle) {
      await changeName(id, isEditedTitle);
    }

    setIsEditing(false);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsEditedTitle(title);
      setIsEditing(false);
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      checkTitle(isEditedTitle);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

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
        <form onSubmit={(event) => {
          event.preventDefault();
          checkTitle(isEditedTitle);
        }}
        >
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={isEditedTitle}
            onChange={event => setIsEditedTitle(event.target.value)}
            onKeyUp={handleKeyUp}
            onBlur={async () => {
              await checkTitle(isEditedTitle);
            }}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {isEditedTitle}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => {
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
