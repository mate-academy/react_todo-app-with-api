/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';

interface TodoItemProps {
  todo: Todo;
  isActiveModal: boolean;
  handleDeleteTodo: (todoId: number) => Promise<void>;
  handleUpdateTodo: (updatedTodo: Todo) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed, userId },
  isActiveModal,
  handleDeleteTodo,
  handleUpdateTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState(title);

  const todoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoInputRef.current) {
      todoInputRef.current.focus();
    }
  }, [isEditing]);

  const updateTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleUpdateTodo({
      id,
      title,
      completed: event.target.checked,
      userId,
    });
  };

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();

    if (query === title) {
      setIsEditing(false);

      return;
    }

    if (!query.trim()) {
      handleDeleteTodo(id);

      return;
    }

    handleUpdateTodo({ id, title: query.trim(), completed, userId })
      .then(() => setIsEditing(false))
      .catch(() => {});
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      setIsEditing(false);
      handleSubmit();
    }, 100);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={updateTodo}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onBlur={handleOnBlur}
            onChange={event => setQuery(event.target.value)}
            onKeyUp={event => event.key === 'Escape' && setIsEditing(false)}
            ref={todoInputRef}
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
            onClick={() => handleDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActiveModal,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
