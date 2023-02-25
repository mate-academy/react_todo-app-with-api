/* eslint-disable jsx-a11y/click-events-have-key-events */
import classNames from 'classnames';
import { KeyboardEvent, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (value: number) => void;
  onUpdate: (id: number, data: Partial<Todo>) => void;
  isProcessing: (id: number) => boolean;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  onUpdate,
  isProcessing,
}) => {
  const { title, completed, id } = todo;
  const [newValue, setValue] = useState(title);
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleSubmit = () => {
    if (!newValue) {
      onDelete(todo.id);
      setIsEditing(false);

      return;
    }

    if (todo.title !== newValue) {
      onUpdate(todo.id, { title: newValue });
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <li className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(id, { completed: !todo.completed })}
        />
      </label>

      {isEditing
        ? (
          <form onSubmit={handleTitleSubmit}>
            <input
              type="text"
              className="todo__title-field"
              value={newValue}
              placeholder="Empty title will be deleted"
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyDown}
              onChange={((e) => setValue(e.target.value))}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
          </form>
        )
        : (
          <>
            <span
              className="todo__title"
              role="button"
              tabIndex={0}
              onClick={(e) => (e.detail === 2
                ? setIsEditing(true)
                : setIsEditing(false))}
            >
              {title}

            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onDelete(id)}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay',
        { 'is-active': isProcessing(id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </li>
  );
};
