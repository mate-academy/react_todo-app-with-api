import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  onDelete?: (todoId: number) => Promise<void>;
  onUpdate?: (id: number, body: Partial<Omit<Todo, 'id'>>) => Promise<void>;
  deleting?: boolean;
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({
  onDelete = () => {},
  onUpdate = () => {},
  deleting = false,
  todo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(todo.title);

  useEffect(() => {
    setIsLoading(deleting);
  }, [deleting]);

  const handleSubmitEditing = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    if (inputValue && inputValue !== todo.title) {
      await onUpdate(todo.id, { title: inputValue });
    }

    if (!inputValue) {
      await onDelete(todo.id);
    }

    setIsLoading(false);
    setIsEditing(false);
  };

  const handleCheckboxClick = async () => {
    setIsLoading(true);
    await onUpdate(todo.id, { completed: !todo.completed });
    setIsLoading(false);
  };

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={handleCheckboxClick}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleSubmitEditing}>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
              onBlur={() => {
                setIsEditing(false);
                setInputValue(todo.title);
              }}

            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsEditing(true)}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              onClick={() => {
                setIsLoading(true);
                onDelete(todo.id);
              }}
            >
              ×
            </button>
          </>
        )}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': todo.id === 0 || isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
