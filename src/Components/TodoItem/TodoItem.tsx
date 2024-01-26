import React, { useContext, useState, useRef } from 'react';
import classNames from 'classnames';

import { Context } from '../../Context';

import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const { handleRemoveTodo, handleUpdateTodo } = useContext(Context);
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditing(true);

    if (inputRef.current) {
      inputRef.current.value = title;
    }
  };

  const handleTitleUpdate = () => {
    if (!inputRef.current) {
      return;
    }

    if (inputRef.current.value.trim()) {
      handleUpdateTodo({
        ...todo,
        title: inputRef.current.value,
      });
    } else {
      handleRemoveTodo(id);
    }

    setEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleTitleUpdate();
    } else if (event.key === 'Escape') {
      setEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          id={`toggle-${id}`}
          checked={completed}
          onChange={() => handleUpdateTodo({ ...todo, completed: !completed })}
        />
      </label>

      {editing ? (
        <form onSubmit={handleTitleUpdate}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            onKeyDown={handleKeyDown}
            onBlur={() => setEditing(false)}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <label
            data-cy="TodoTitle"
            className="todo__title"
            htmlFor={`toggle-${id}`}
            onDoubleClick={handleEdit}
          >
            {title}
          </label>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleRemoveTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
