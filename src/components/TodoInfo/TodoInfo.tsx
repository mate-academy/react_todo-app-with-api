/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo, UpdateTodoArgs } from '../../types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (arg: number) => void;
  removingTodoId: number;
  updatedTodoId: number[];
  changeTodoDetails: (todoId: number, data: UpdateTodoArgs) => void;
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  removingTodoId,
  updatedTodoId,
  changeTodoDetails,
}) => {
  const {
    id,
    completed,
    title,
  } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const changeTodoStatus = async () => {
    await changeTodoDetails(
      id,
      { completed: !completed },
    );
  };

  const changeTodoTitle = async () => {
    await changeTodoDetails(
      id,
      { title: editedTitle },
    );
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    changeTodoTitle();
    setIsEditing(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeTodoTitle();
    setIsEditing(false);
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      key={id}
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onChange={changeTodoStatus}
          checked
        />
      </label>

      {isEditing
        ? (
          <form
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              className="todo__title-field"
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={handleBlur}
              ref={inputRef}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              // autoFocus
            />
          </form>
        )
        : (
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {title}
          </span>
        )}

      <button
        type="button"
        className={classNames('todo__remove', {
          'is-hidden': isEditing,
        })}
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': updatedTodoId.includes(id) || id === removingTodoId,
      })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
