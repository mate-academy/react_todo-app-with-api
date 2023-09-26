import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  onDeleteTodo?: (todoId: number) => void;
  onTodoUpdate?: (todoTitle: string) => void;
  isProcessing: boolean;
  onToggleTodo?: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo = () => {},
  onTodoUpdate = () => {},
  isProcessing,
  onToggleTodo = () => {},
}) => {
  const { title, id, completed } = todo;

  const [isEditing, setIsEditing] = useState(false);
  const [todoTitle, setTodoTitle] = useState(title);

  const handleTodoDoubleClick = () => {
    setIsEditing(true);
  };

  const handleTodoSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle) {
      await onTodoUpdate(todoTitle);
    } else {
      await onDeleteTodo(id);
    }

    setIsEditing(false);
  };

  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && titleInput) {
      titleInput.current?.focus();
    }
  }, [isEditing]);

  const handleTodoTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTodoTitle(event.target.value);
  };

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setTodoTitle(title);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      key={id}
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed === true,
      })}
      onKeyUp={handleKeyUp}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onToggleTodo(todo)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={handleTodoSave}
          onBlur={handleTodoSave}
        >
          <input
            ref={titleInput}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoTitle}
            onChange={handleTodoTitleChange}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleTodoDoubleClick}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
