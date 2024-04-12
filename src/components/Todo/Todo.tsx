import React, { useEffect, useRef, useState } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import classNames from 'classnames';
import { useTodos } from '../../utils/hooks';

type Props = {
  todo: TodoType;
  isActive?: boolean;
};

export const Todo: React.FC<Props> = ({ todo, isActive = false }) => {
  const { handleDeleteTodo, toggleTodo, renameTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      titleField?.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (normalizedTitle === todo.title) {
      setIsEditing(false);

      return;
    }

    if (!normalizedTitle) {
      handleDeleteTodo(todo);

      return;
    }

    try {
      await renameTodo(todo, normalizedTitle);

      setIsEditing(false);
    } catch (error) {
      titleField.current?.focus();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label" aria-label="status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            ref={titleField}
            onBlur={handleSubmit}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsEditing(true);
              setTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
