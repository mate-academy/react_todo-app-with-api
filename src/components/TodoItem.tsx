import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: () => Promise<void>,
  onRename?: (title: string) => void,
  onToggle?: () => Promise<void>,
  loading?: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onRename,
  onToggle,
  loading,
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape') {
      return;
    }

    setEditing(false);
    setTitle(todo.title);
  };

  const save = async () => {
    if (title) {
      setIsModalActive(true);
      setIsDisabledInput(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onRename ? await onRename(title) : null;
      setIsModalActive(false);
    } else {
      setIsModalActive(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onDelete ? await onDelete() : null;
      setIsModalActive(false);
    }

    setEditing(false);
    setIsDisabledInput(false);
  };

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            setIsModalActive(true);

            if (onToggle) {
              onToggle()
                .then(() => setIsModalActive(false));
            }
          }}
        />
      </label>

      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <input
            onKeyUp={handleKeyUp}
            onBlur={save}
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isDisabledInput}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditing(true)}
          >
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              if (onDelete) {
                setIsModalActive(true);
                onDelete()
                  .then(() => setIsModalActive(false));
              }
            }}
          >
            ×
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isModalActive || todo.id === 0 || loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
