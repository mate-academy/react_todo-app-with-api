import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import React, { useState } from 'react';

interface Props {
  todo: Todo;
  onTodoRemove?: (todoId: number) => Promise<void>;
  onTodoUpdate?: (todo: Todo) => Promise<void>;
  hasTempTodo?: boolean;
  isPending?: boolean;
}

const TodoItem = ({
  todo,
  onTodoUpdate,
  onTodoRemove,
  hasTempTodo = false,
  isPending = false,
}: Props) => {
  const { id, title, completed } = todo;

  const [titleInput, setTitleInput] = useState(title);
  const [hasEditMode, setHasEditMode] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizeTitle = titleInput.trim();

    setTitleInput(normalizeTitle);

    if (normalizeTitle === title) {
      setHasEditMode(false);

      return;
    }

    onTodoUpdate?.({ ...todo, title: normalizeTitle })
      .then(() => {
        setHasEditMode(false);
      })
      .catch(() => {
        setHasEditMode(true);
      });
  };

  const handleCancelUpdate = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Escape') {
      setHasEditMode(false);
      setTitleInput(title);
    }
  };

  const handleDelete = (todoId: number) => {
    onTodoRemove?.(todoId);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label aria-label="Todo Status" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => onTodoUpdate?.({ ...todo, completed: !completed })}
        />
      </label>

      {!hasEditMode ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setHasEditMode(true);
            }}
          >
            {titleInput}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(id)}
          >
            {isPending ? '···' : '×'}
          </button>
        </>
      ) : (
        <form
          onSubmit={event => onSubmit(event)}
          onBlur={event => onSubmit(event)}
          onKeyUp={event => handleCancelUpdate(event)}
        >
          <input
            autoFocus
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={titleInput}
            onChange={event => setTitleInput(event.target.value)}
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': hasTempTodo || isPending,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
