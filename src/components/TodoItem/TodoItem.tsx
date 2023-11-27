import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loading: number[];
  onUpdate: (todo: Todo) => void;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  onUpdate,
  onDelete,
}) => {
  const { id, title, completed } = todo;
  const [value, setValue] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const updateTitle = () => {
    switch (value.trim()) {
      case '':
        onDelete(todo.id);
        break;
      case todo.title:
        setIsEditing(false);
        break;
      default:
        onUpdate({ ...todo, title: value });
    }

    setIsEditing(false);
  };

  const handleSetTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTitle();
    setIsEditing(false);
  };

  const handleChecked = (currentTodo: Todo) => {
    onUpdate({ ...currentTodo, completed: !currentTodo.completed });
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <li
      className={classNames('todo', {
        completed,
        editing: isEditing,
      })}
    >
      {/* eslint-disable jsx-a11y/control-has-associated-label */}
      <label
        className="todo__status-label"
        htmlFor={`toggle-view-${id}`}
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`toggle-view-${id}`}
          onClick={() => handleChecked(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={todo.title}
            onChange={handleSetTitle}
            ref={inputRef}
            onBlur={updateTitle}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(id)}
            aria-label="Delete"
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
