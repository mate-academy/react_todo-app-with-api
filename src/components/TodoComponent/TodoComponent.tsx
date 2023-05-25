import React, { FC, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onRemove?: (todoData: Todo) => void;
  onChangeTodo?: (todo: Todo, value: boolean | string) => void;
  isTempTodo: boolean;
}

export const TodoComponent: FC<Props> = React.memo(({
  todo,
  onRemove = () => {},
  onChangeTodo = () => {},
  isTempTodo,
}) => {
  const { title, completed } = todo;

  const [name, setName] = useState(title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDeleteTodo = () => {
    onRemove(todo);
  };

  const updateTitle = () => {
    setIsUpdating(false);

    if (title === name) {
      setName(title);

      return;
    }

    if (name.trim() === '') {
      handleDeleteTodo();
      setName(title);

      return;
    }

    onChangeTodo(todo, name);

    setName(title);
  };

  const handleSubmitUpdate = (event: FormEvent) => {
    event.preventDefault();

    updateTitle();
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={(event) => onChangeTodo(todo, event.target.checked)}
        />
      </label>

      {!isUpdating
        ? (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setIsUpdating(true)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleDeleteTodo}
            >
              ×
            </button>
          </>
        )
        : (
          <form
            onSubmit={handleSubmitUpdate}
          >
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onBlur={() => {
                updateTitle();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setIsUpdating(false);
                  setName(title);
                }
              }}
              // eslint-disable-next-line
              autoFocus
            />
          </form>
        )}

      <div className={classNames('modal overlay', { 'is-active': isTempTodo })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
