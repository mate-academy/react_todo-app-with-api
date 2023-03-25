import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => void;
  idUpdating: number[];
  handleUpdate: (id: number, data: boolean | string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  idUpdating,
  handleUpdate,
}) => {
  const { id, title, completed } = todo;

  const [isTodoUpdating, setIsTodoUpdating] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const todoTitle = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoTitle.current) {
      todoTitle.current.focus();
    }
  }, [isTodoUpdating]);

  const changeTitle = (str: string) => {
    switch (str) {
      case title:
        return;
      case '':
        removeTodo(id);

        return;

      default:
        handleUpdate(id, str);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    changeTitle(newTitle);
    setIsTodoUpdating(false);
  };

  const handleBlur = () => {
    changeTitle(newTitle);
    setIsTodoUpdating(false);
  };

  const handleCancel = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setNewTitle(title);
      setIsTodoUpdating(false);
    }
  };

  return (
    <li
      className={classNames('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={() => handleUpdate(id, !completed)}
        />
      </label>

      {isTodoUpdating ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
            className="todo__title-field"
            onBlur={handleBlur}
            ref={todoTitle}
            onKeyUp={handleCancel}
            placeholder="Empty todo will be deleted"
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsTodoUpdating(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => removeTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames(
        'modal', 'overlay',
        { 'is-active': idUpdating.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
