import { FC, FormEvent, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: () => void;
  onToggle?: () => void;
  onRename?: (todo: Todo) => void;
  isLoading: boolean;
}

const noOperation = () => {};

export const TodoItem: FC<Props> = ({
  todo,
  onDelete = noOperation,
  onToggle = noOperation,
  onRename = noOperation,
  isLoading,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => setIsRenaming(false), [todo]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedNewTitle = newTitle.trim();

    if (trimmedNewTitle === todo.title) {
      setIsRenaming(false);

      return;
    }

    if (!trimmedNewTitle) {
      onDelete();

      return;
    }

    onRename({ ...todo, title: trimmedNewTitle });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        {null}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={onToggle}
        />
      </label>

      {isRenaming ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
          onKeyUp={event => {
            if (event.key === 'Escape') {
              setIsRenaming(false);
            }
          }}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            onChange={event => setNewTitle(event.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setIsRenaming(true);
              setNewTitle(todo.title);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={onDelete}
          >
            ×
          </button>
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
