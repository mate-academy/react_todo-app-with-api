import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  updatingIds: number[];
  removeTodo: (id:number) => void;
  handleUpdate: (id: number, data: boolean | string) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  updatingIds,
  removeTodo,
  handleUpdate,
}) => {
  const { id, title, completed } = todo;
  const [isTodoEditing, setIsTodoEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const todoTitleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoTitleInput.current) {
      todoTitleInput.current.focus();
    }
  }, [isTodoEditing]);

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
    setIsTodoEditing(false);
  };

  const handleBlur = () => {
    changeTitle(newTitle);
    setIsTodoEditing(false);
  };

  const handleCancel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Escape') {
      setNewTitle(title);
      setIsTodoEditing(false);
    }
  };

  return (
    <li className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleUpdate(id, !completed)}
        />
      </label>

      {isTodoEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={todoTitleInput}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onBlur={handleBlur}
            onKeyUp={handleCancel}
            onChange={e => setNewTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsTodoEditing(true)}
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
        'modal',
        'overlay',
        { 'is-active': updatingIds.includes(id) },
      )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
