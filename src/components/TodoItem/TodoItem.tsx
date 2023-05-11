import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  loadingId: number[],
  onRemove: (todoId: number) => void,
  onChange: (todoId: number, data: {
    completed?: boolean,
    title?: string,
  }) => void,
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  loadingId,
  onRemove,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isEditing]);

  const updateTodo = () => {
    setIsEditing(false);

    if (title === todo.title) {
      return undefined;
    }

    return title === ''
      ? onRemove(todo.id)
      : onChange(todo.id, { title });
  };

  const isLoading = (todoId: number) => {
    return loadingId.some(item => item === todoId);
  };

  const handleClick = () => onRemove(todo.id);

  const handleCheckboxChange = () => {
    onChange(todo.id, {
      completed: !todo.completed,
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTodo();
  };

  const handleBlur = () => updateTodo();

  const handleDoubleClick = () => setIsEditing(true);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
      setTitle(todo.title);
    }
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={handleCheckboxChange}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={title}
            onChange={handleTitleChange}
            onBlur={handleBlur}
            onKeyUp={handleKeyUp}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleClick}
          >
            ×
          </button>
        </>
      )}

      <div
        className="modal overlay"
        style={{
          display: isLoading(todo.id)
            ? 'flex'
            : 'none',
        }}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
