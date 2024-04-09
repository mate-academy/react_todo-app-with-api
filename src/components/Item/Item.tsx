import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { ItemLoader } from '../ItemLoader';
import React, { useEffect, useRef, useState } from 'react';

type Props = {
  todo: Todo;
  isTempTodo?: boolean;
  isUpdating?: boolean;
  onTodoDelete: (id: number) => void;
  onTodoCheck: (todo: Todo) => void;
  onTodoUpdate: (todo: Todo) => void;
};

export const Item: React.FC<Props> = ({
  todo,
  isTempTodo = false,
  isUpdating = false,
  onTodoDelete,
  onTodoCheck,
  onTodoUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [titleInput, setTitleInput] = useState(todo.title);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setTitleInput(todo.title);
  };

  const handleSubmit = () => {
    setIsEditing(false);

    const normalizedTitle = titleInput.trim();

    if (normalizedTitle) {
      if (normalizedTitle !== todo.title) {
        onTodoUpdate({
          ...todo,
          title: normalizedTitle,
        });
      }
    } else {
      onTodoDelete(todo.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === 'Enter') {
      handleSubmit();
    } else if (key === 'Escape') {
      setTitleInput(todo.title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <div
        onClick={() => {
          onTodoCheck(todo);
        }}
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </div>

      {isEditing ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleInput}
            onBlur={() => handleSubmit()}
            onKeyDown={event => handleKeyDown(event)}
            onChange={event => setTitleInput(event.target.value)}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {titleInput}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <ItemLoader isActive={isTempTodo || isUpdating} />
    </div>
  );
};
