import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  handleDeleteTodo: (id: number) => void,
  updateTodoId: number[],
  changeStatus: (id: number, property: Partial<Todo>) => void,
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  handleDeleteTodo,
  updateTodoId,
  changeStatus,
}) => {
  const { id, title, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const updateTodoTitle = () => {
    if (changedTitle === title) {
      setIsEditing(false);

      return;
    }

    if (!changedTitle.trim()) {
      setIsEditing(true);
      handleDeleteTodo(id);
    }

    changeStatus(id, { title: changedTitle });
    setIsEditing(false);
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodoTitle();
  };

  const cancelEditing = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setChangedTitle(title);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          data-sy="TodoStatus"
          checked={completed}
          onChange={() => {
            changeStatus(id, { completed: !completed });
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTitle}
            onChange={handleChangeTitle}
            onBlur={updateTodoTitle}
            onKeyUp={cancelEditing}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => handleDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div className={classNames('modal overlay',
        {
          'is-active': updateTodoId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
